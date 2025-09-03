import CategoriesContainer from "@/components/faqs/CategoriesContainer";
import FaqsContainer from "@/components/faqs/FaqsContainer";
import SubDepartmentsContainer from "@/components/faqs/SubDepartmentsContainer";
import PageLayout from "@/components/layout/PageLayout";
import TicketWrapper from "@/components/support-ticket/TicketWrapper";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LogoutButton } from "@/components/ui/LogoutButton";
import WelcomeSection from "@/components/ui/WelcomeSection";
import FloatingChatWindowRight from "@/components/chat/FloatingChatWindowRight";

export default function Home() {
  return (
    <PageLayout>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <WelcomeSection
                title="Welcome to Our Chatbot"
                description="Ask us anything! We're here to help with your administrative and business needs"
              />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LogoutButton />
            </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto flex flex-col flex-1 gap-6 px-4 py-6 lg:gap-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">
              How can we help you?
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our comprehensive FAQ section to find answers and get
              assistance.
            </p>
          </div>

          <div className="mt-12 space-y-8">
            <div className="animate-fade-in">
              <h2 className="text-2xl font-semibold text-center mb-6 text-foreground">
                Browse by Category
              </h2>
              <CategoriesContainer />
            </div>

            <div className="animate-fade-in">
              <SubDepartmentsContainer />
            </div>

            <div className="max-w-4xl mx-auto animate-fade-in">
              <FaqsContainer />
            </div>
          </div>
          <TicketWrapper />
        </div>
      </div>

      {/* Floating Chat Window - Bottom Right */}
      <FloatingChatWindowRight />
    </PageLayout>
  );
}
