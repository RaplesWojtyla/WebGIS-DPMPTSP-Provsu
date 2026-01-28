import Hero from "@/components/Landing/Hero";
import About from "@/components/Landing/About";
import Services from "@/components/Landing/Services";
import Investment from "@/components/Landing/Investment";
import News from "@/components/Landing/News";
import FAQ from "@/components/Landing/FAQ";
import Contact from "@/components/Landing/Contact";
import SectionWrapper from "@/components/Landing/SectionWrapper";

export default function Home() {
	return (
		<main className="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
			<SectionWrapper>
				<Hero />
			</SectionWrapper>

			<SectionWrapper delay={0.2}>
				<About />
			</SectionWrapper>

			<SectionWrapper>
				<Services />
			</SectionWrapper>

			<SectionWrapper>
				<Investment />
			</SectionWrapper>

			<SectionWrapper>
				<News />
			</SectionWrapper>

			<SectionWrapper>
				<FAQ />
			</SectionWrapper>

			<SectionWrapper>
				<Contact />
			</SectionWrapper>
		</main>
	);
}
