"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Palette, Code, Sparkles } from "lucide-react";

const ThemeShowcase = () => {
  const { theme } = useTheme();

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Optimized performance with modern tech stack",
      color: "neon-text-primary"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Beautiful Design",
      description: "Professional neon themes for digital agencies",
      color: "neon-text-accent"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Clean Code",
      description: "Well-structured and maintainable codebase",
      color: "neon-text-primary"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Modern Effects",
      description: "Glassmorphism and neon glow effects",
      color: "neon-text-accent"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 agency-text-gradient">
            Professional Agency Themes
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Experience the power of professional themes designed for digital agencies - both light and dark modes
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Badge variant="outline" className="neon-border">
              Current Theme: {theme || 'Loading...'}
            </Badge>
            <Badge variant="secondary">
              {theme?.includes('light') || theme === 'light' ? 'Light Mode' : 'Dark Mode'}
            </Badge>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="neon-card hover-neon">
              <CardHeader className="text-center">
                <div className={`mx-auto mb-4 ${feature.color}`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactive Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Buttons Showcase */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Interactive Elements</CardTitle>
              <CardDescription>
                Buttons and interactive components with neon effects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="btn-neon w-full">
                Primary Neon Button
              </Button>
              <Button variant="outline" className="neon-border w-full">
                Outlined Neon Button
              </Button>
              <Button variant="ghost" className="neon-text-primary w-full">
                Ghost Neon Button
              </Button>
            </CardContent>
          </Card>

          {/* Color Palette */}
          <Card className="glass-effect-strong">
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
              <CardDescription>
                Professional neon colors for digital agencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary neon-glow-primary"></div>
                  <p className="text-sm">Primary</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-accent neon-glow-accent"></div>
                  <p className="text-sm">Accent</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-muted border border-border"></div>
                  <p className="text-sm">Muted</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gradient Showcase */}
        <Card className="bg-gradient-agency text-white mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Agency Gradient Background</CardTitle>
            <CardDescription className="text-white/80">
              Beautiful gradients that make your content stand out
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              Call to Action
            </Button>
          </CardContent>
        </Card>

        {/* Animation Showcase */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6 neon-text-primary">Animation Effects</h2>
          <div className="flex justify-center space-x-8">
            <div className="animate-neon-pulse">
              <div className="w-16 h-16 bg-primary rounded-full neon-glow-primary"></div>
              <p className="mt-2 text-sm">Neon Pulse</p>
            </div>
            <div className="animate-float">
              <div className="w-16 h-16 bg-accent rounded-full neon-glow-accent"></div>
              <p className="mt-2 text-sm">Float</p>
            </div>
            <div className="animate-neon-flicker">
              <div className="w-16 h-16 bg-primary rounded-full neon-glow-primary"></div>
              <p className="mt-2 text-sm">Flicker</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeShowcase;
