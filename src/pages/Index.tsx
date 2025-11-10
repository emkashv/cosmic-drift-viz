import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Send, Paperclip, X, Sparkles } from 'lucide-react';

type MessageContent = string | { type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } };

type Message = {
  role: 'user' | 'assistant';
  content: string | MessageContent[];
};

type AttachedFile = {
  name: string;
  type: string;
  url: string;
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: AttachedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      await new Promise((resolve) => {
        reader.onload = (e) => {
          const url = e.target?.result as string;
          newFiles.push({
            name: file.name,
            type: file.type,
            url: url,
          });
          resolve(null);
        };
        reader.readAsDataURL(file);
      });
    }
    
    setAttachedFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async (messageInput: string) => {
    if (!messageInput.trim() && attachedFiles.length === 0) return;

    const content: MessageContent[] = [];
    
    if (messageInput.trim()) {
      content.push({ type: 'text', text: messageInput });
    }
    
    attachedFiles.forEach(file => {
      content.push({
        type: 'image_url',
        image_url: { url: file.url }
      });
    });

    const userMessage: Message = { 
      role: 'user', 
      content: content.length === 1 && typeof content[0] === 'object' && 'text' in content[0] 
        ? content[0].text 
        : content 
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setAttachedFiles([]);
    setIsLoading(true);

    let assistantContent = '';

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: [...messages, userMessage] }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: 'Превышен лимит',
            description: 'Слишком много запросов. Попробуйте позже.',
            variant: 'destructive',
          });
          setMessages((prev) => prev.slice(0, -1));
          setIsLoading(false);
          return;
        }
        if (response.status === 402) {
          toast({
            title: 'Требуется оплата',
            description: 'Пополните баланс для продолжения.',
            variant: 'destructive',
          });
          setMessages((prev) => prev.slice(0, -1));
          setIsLoading(false);
          return;
        }
        throw new Error('Ошибка сети');
      }

      if (!response.body) throw new Error('Нет потока данных');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let streamDone = false;

      const updateAssistant = (chunk: string) => {
        assistantContent += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant') {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantContent } : m
            );
          }
          return [...prev, { role: 'assistant', content: assistantContent }];
        });
      };

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch {}
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Ошибка чата:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить сообщение',
        variant: 'destructive',
      });
      setMessages((prev) => prev.slice(0, -1));
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && attachedFiles.length === 0) || isLoading) return;
    sendMessage(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Ares AI</h1>
            <p className="text-xs text-muted-foreground">Developed for an easier life</p>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Привет! Я Ares</h2>
              <p className="text-muted-foreground max-w-md">
                Я помогу вам с программированием, анализом данных, работой с изображениями и многим другим
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              const textContent = typeof msg.content === 'string' 
                ? msg.content 
                : Array.isArray(msg.content)
                  ? msg.content.find(c => typeof c === 'object' && 'text' in c)?.text || ''
                  : '';
              const images = Array.isArray(msg.content)
                ? msg.content.filter(c => typeof c === 'object' && 'image_url' in c)
                : [];
              
              return (
                <div
                  key={idx}
                  className={cn(
                    'flex gap-4 mb-8 animate-fade-in',
                    isUser ? 'justify-end' : 'justify-start'
                  )}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className={cn('flex-1 max-w-[85%]', isUser && 'flex justify-end')}>
                    <div className={cn(
                      'rounded-2xl px-4 py-3',
                      isUser 
                        ? 'bg-primary text-primary-foreground ml-auto' 
                        : 'bg-muted text-foreground'
                    )}>
                      {images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {images.map((img: any, imgIdx: number) => (
                            <img
                              key={imgIdx}
                              src={img.image_url.url}
                              alt="Attached"
                              className="max-w-[200px] max-h-[200px] rounded-lg object-cover"
                            />
                          ))}
                        </div>
                      )}
                      <p className="whitespace-pre-wrap break-words">{textContent}</p>
                    </div>
                  </div>
                  {isUser && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-primary-foreground">Я</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
          {isLoading && (
            <div className="flex gap-4 mb-8">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 border-t bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 p-2 bg-muted/50 rounded-lg">
              {attachedFiles.map((file, idx) => (
                <div key={idx} className="relative group">
                  <div className="flex items-center gap-2 bg-background px-3 py-2 rounded-lg border">
                    {file.type.startsWith('image/') ? (
                      <img src={file.url} alt={file.name} className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center bg-muted rounded">
                        <Paperclip className="h-5 w-5" />
                      </div>
                    )}
                    <span className="text-sm max-w-[100px] truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="ml-2 p-1 hover:bg-destructive/10 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              className="hidden"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              className="h-10 w-10 shrink-0 rounded-full"
              disabled={isLoading}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Отправить сообщение Ares..."
                className="min-h-[52px] max-h-[200px] resize-none pr-12 rounded-3xl border-2"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="absolute right-2 bottom-2 h-8 w-8 rounded-full"
                disabled={isLoading || (!input.trim() && attachedFiles.length === 0)}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
