import Hero from '@/components/home/Hero';
import LatestFinds from '@/components/home/LatestFinds';
import Features from '@/components/home/Features';
import Tools from '@/components/home/Tools';
import AgentsMarquee from '@/components/home/AgentsMarquee';
import FeaturedAgents from '@/components/home/FeaturedAgents';
import CommunityCTA from '@/components/home/CommunityCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <AgentsMarquee />
      <FeaturedAgents />
      <LatestFinds />
      <Features />
      <Tools />
      <CommunityCTA />
    </>
  );
}
