import { SpaceHero } from "@/components/SpaceHero";
import { PlanetCard } from "@/components/PlanetCard";
import { ParallaxSection } from "@/components/ParallaxSection";
import { FloatingElement } from "@/components/FloatingElement";
import { Sparkles, Orbit, Telescope } from "lucide-react";
import planetEarth from "@/assets/planet-earth.jpg";
import planetMars from "@/assets/planet-mars.jpg";
import planetJupiter from "@/assets/planet-jupiter.jpg";

const Index = () => {
  const planets = [
    {
      name: "Earth",
      description: "Our home planet, a blue marble in the vastness of space. The only known world to harbor life, with diverse ecosystems and breathtaking landscapes.",
      image: planetEarth,
      facts: [
        "71% of surface covered by water",
        "Only planet known to support life",
        "Has one natural satellite: the Moon",
        "Age: 4.5 billion years"
      ]
    },
    {
      name: "Mars",
      description: "The Red Planet beckons as humanity's next frontier. With ancient riverbeds and towering volcanoes, Mars holds secrets of our solar system's past.",
      image: planetMars,
      facts: [
        "Home to Olympus Mons, the largest volcano",
        "Day length similar to Earth: 24.6 hours",
        "Has two small moons: Phobos and Deimos",
        "Ancient evidence of liquid water"
      ]
    },
    {
      name: "Jupiter",
      description: "The gas giant king of our solar system. Jupiter's massive presence has shaped the orbits and fate of countless celestial bodies.",
      image: planetJupiter,
      facts: [
        "Largest planet in our solar system",
        "Great Red Spot: a storm larger than Earth",
        "Has 95 known moons",
        "Could fit 1,300 Earths inside"
      ]
    }
  ];

  const discoveries = [
    {
      icon: Sparkles,
      title: "Nebulae",
      description: "Cosmic clouds where stars are born, painting the universe with ethereal colors"
    },
    {
      icon: Orbit,
      title: "Exoplanets",
      description: "Over 5,000 worlds discovered beyond our solar system, each unique and mysterious"
    },
    {
      icon: Telescope,
      title: "Deep Space",
      description: "Exploring the cosmic web, dark matter, and the very edges of the observable universe"
    }
  ];

  return (
    <div className="min-h-screen">
      <SpaceHero />
      
      {/* Planets Section */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute inset-0"
            style={{ background: 'var(--gradient-nebula)' }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <ParallaxSection speed={0.2}>
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-4 text-gradient">
                Journey Through Worlds
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover the magnificent planets that orbit our Sun, each with its own story to tell
              </p>
            </div>
          </ParallaxSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {planets.map((planet, index) => (
              <FloatingElement key={planet.name} delay={index * 0.2}>
                <PlanetCard {...planet} index={index} />
              </FloatingElement>
            ))}
          </div>
        </div>
      </section>

      {/* Discoveries Section */}
      <section className="relative py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <ParallaxSection speed={0.3}>
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 text-gradient">
              Cosmic Discoveries
            </h2>
          </ParallaxSection>

          <div className="grid md:grid-cols-3 gap-8">
            {discoveries.map((discovery, index) => {
              const Icon = discovery.icon;
              return (
                <FloatingElement key={discovery.title} delay={index * 0.3} duration={7}>
                  <div className="text-center p-8 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm hover:border-cosmic-purple transition-all duration-500 hover:glow-accent">
                    <div className="inline-block p-4 rounded-full bg-cosmic-purple/20 mb-4">
                      <Icon className="h-8 w-8 text-cosmic-purple" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-cosmic-blue">
                      {discovery.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {discovery.description}
                    </p>
                  </div>
                </FloatingElement>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cosmic-blue rounded-full animate-drift"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
            />
          ))}
        </div>

        <ParallaxSection speed={0.4}>
          <div className="relative text-center max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">
              The Universe Awaits
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Every star, every planet, every nebula holds countless wonders yet to be discovered. 
              The cosmos is infinite, and so are the possibilities.
            </p>
          </div>
        </ParallaxSection>
      </section>
    </div>
  );
};

export default Index;
