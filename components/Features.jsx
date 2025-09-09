"use client";

import { motion } from "framer-motion";
import { Users, Brain, BarChart, Mail, UserPlus, Settings } from "lucide-react";

export function FeatureSection() {
  const features = [
    {
      icon: <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      title: "Join Any Queue",
      description:
        "Browse and join public queues with just a few clicks. Get real-time updates on your position.",
      delay: 0.1,
    },
    {
      icon: <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      title: "Email Notifications",
      description:
        "Receive email confirmations and updates about your position in the queue.",
      delay: 0.2,
    },
    {
      icon: (
        <UserPlus className="h-6 w-6 text-purple-600 dark:text-purple-400" />
      ),
      title: "Create Custom Queues",
      description:
        "Create queues with custom fields to collect the information you need from your guests.",
      delay: 0.3,
    },
    {
      icon: (
        <BarChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
      ),
      title: "Live Queue Analytics",
      description:
        "View real-time data about your queue, including wait times and guest information.",
      delay: 0.4,
    },
    {
      icon: <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      title: "AI Insights",
      description:
        "Get AI powered suggestions to optimize your queue management and improve efficiency.",
      delay: 0.5,
    },
    {
      icon: (
        <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
      ),
      title: "Customizable Workflow",
      description:
        "Tailor the queue management process to fit your specific business needs.",
      delay: 0.6,
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Powerful Features for Everyone
          </motion.h2>
          <motion.p
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Whether you're joining a queue or managing one, Qline has the tools
            you need.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: feature.delay }}
              whileHover={{ y: -5 }}
            >
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
