"use client";
import CategoriesContainer from "@/components/faqs/CategoriesContainer";
import FaqsContainer from "@/components/faqs/FaqsContainer";
import SubDepartmentsContainer from "@/components/faqs/SubDepartmentsContainer";
import PageLayout from "@/components/layout/PageLayout";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import Image from "next/image";
import Promotion from "@/components/Promotion";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { motion } from "framer-motion";
import { CommonLocales } from "@/public/locales/common/map";
import { SupportedLanguage } from "@/types/translation";
import { useLangStore } from "./store/useLangStore";
import { useEffect } from "react";
import { useLocalesStore } from "./store/useLocalesStore";
import StreamingChatWindow from "@/components/chat/StreamingChatWindow";
import Link from "next/link";
import { Ticket, ArrowRight, ArrowLeft } from "lucide-react";
import { isRTL } from "@/lib/utils";

export default function PageClient({
  locales,
  lang,
}: {
  locales: CommonLocales;
  lang: SupportedLanguage;
}) {
  const { setLang } = useLangStore();
  const { setLocales } = useLocalesStore();
  const rtl = isRTL(lang);

  useEffect(() => {
    setLang(lang);
    setLocales(locales);
  }, []);

  useEffect(() => {
    setLocales(locales);
  }, [lang]);

  return (
    <PageLayout>
      {/* Animated Background */}
      <AnimatedBackground />

      <div className="relative flex min-h-screen flex-col z-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur-sm"
                  />
                  <Image
                    src="/smarthelp.png"
                    alt="SmartHelp Logo"
                    width={40}
                    height={40}
                    className="relative rounded-lg shadow-lg"
                  />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent"
                >
                  SmartHelp
                </motion.h1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-center gap-2"
              >
                <LanguageSelector />
                <ThemeToggle />
              </motion.div>
            </div>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="container mx-auto flex flex-col flex-1 gap-8 px-6 py-8 lg:gap-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="text-center relative overflow-hidden rounded-2xl"
          >
            {/* Background glow effect matching dashboard */}
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10"
            />

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative rounded-2xl bg-background p-6 shadow-xl backdrop-blur-sm"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent tracking-tight"
              >
                {locales.welcome.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              >
                {locales.welcome.description}
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Support Tickets CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="relative overflow-hidden rounded-2xl"
            >
              {/* Background glow effect */}
              <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20"
              />
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative rounded-2xl bg-card/80 backdrop-blur-sm p-8 md:p-12 border border-border/20 shadow-xl"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className={`flex-1 text-center ${rtl ? 'md:text-right' : 'md:text-left'}`}>
                    <motion.div
                      initial={{ opacity: 0, x: rtl ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 md:mb-0 ${rtl ? 'md:ml-6' : 'md:mr-6'}`}
                    >
                      <Ticket className="h-8 w-8 text-primary" />
                    </motion.div>
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent"
                    >
                      {locales.tickets?.title || "Didn't find answer?"}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                      className="text-muted-foreground text-lg"
                    >
                      {locales.tickets?.description || "Submit a ticket and our support team will get back to you."}
                    </motion.p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: rtl ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                  >
                    <Link
                      href="/support-tickets"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl group"
                    >
                      <span>{locales.ui?.track_your_tickets || "Track Your Tickets"}</span>
                      {rtl ? (
                        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                      ) : (
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      )}
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="space-y-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="relative overflow-hidden rounded-2xl"
            >
              <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10"
              />
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative rounded-2xl bg-background p-6 shadow-xl backdrop-blur-sm"
              >
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="text-2xl font-semibold text-center mb-8 bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent tracking-tight"
                >
                  {locales.categories.title}
                </motion.h2>
                <CategoriesContainer />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <SubDepartmentsContainer />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="max-w-4xl mx-auto"
            >
              <FaqsContainer />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Chat Window - Bottom Right */}
      <StreamingChatWindow />
      <Promotion />
    </PageLayout>
  );
}
