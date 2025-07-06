
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Box, Users, DollarSign, Zap } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { WebGLBackground } from '@/components/effects/WebGLBackground';
import { MouseTrail } from '@/components/effects/MouseTrail';

gsap.registerPlugin(ScrollTrigger);

export const Landing = () => {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const features = featuresRef.current;
    const cta = ctaRef.current;

    if (hero) {
      gsap.fromTo(
        hero.children,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.2, 
          ease: 'power3.out' 
        }
      );
    }

    if (features) {
      gsap.fromTo(
        features.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: features,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    if (cta) {
      gsap.fromTo(
        cta.children,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: cta,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }, []);

  return (
    <div className="relative overflow-hidden">
      <WebGLBackground />
      <MouseTrail />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center z-10" ref={heroRef}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="gradient-text">{t('landing.slogan')}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            {t('landing.description')}
          </p>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12">
            {t('landing.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/marketplace">
              <Button size="lg" className="btn-primary">
                {t('landing.cta.explore')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link to="/add">
              <Button size="lg" variant="outline" className="btn-secondary">
                {t('landing.cta.create')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating cubes inspired by the banner */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-primary rounded-lg opacity-20 animate-float"></div>
          <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-accent/30 rounded-lg opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 left-1/6 w-20 h-20 bg-node-purple/20 rounded-lg opacity-25 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-14 h-14 bg-node-cyan/30 rounded-lg opacity-20 animate-float" style={{animationDelay: '0.5s'}}></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 gradient-text">
            {t('landing.features.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" ref={featuresRef}>
            <div className="node-card text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-lg mx-auto mb-6 flex items-center justify-center">
                <Box className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('landing.features.open.title')}</h3>
              <p className="text-muted-foreground">{t('landing.features.open.desc')}</p>
            </div>
            
            <div className="node-card text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-lg mx-auto mb-6 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('landing.features.monetize.title')}</h3>
              <p className="text-muted-foreground">{t('landing.features.monetize.desc')}</p>
            </div>
            
            <div className="node-card text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-lg mx-auto mb-6 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('landing.features.community.title')}</h3>
              <p className="text-muted-foreground">{t('landing.features.community.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center" ref={ctaRef}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 gradient-text">
            Ready to Start Building?
          </h2>
          
          <p className="text-lg text-muted-foreground mb-12">
            Join the community of traders creating the future of Web3 workflows
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/marketplace">
              <Button size="lg" className="btn-primary">
                <Zap className="w-5 h-5 mr-2" />
                Explore Nodes
              </Button>
            </Link>
            
            <Link to="/add">
              <Button size="lg" variant="outline" className="btn-secondary">
                Create Your First Node
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
