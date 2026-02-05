import { motion } from "framer-motion";
import { Truck, Shield, HeartHandshake, RotateCcw } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Spedizione Veloce",
    description: "Consegna in 2-4 giorni lavorativi in tutta Italia"
  },
  {
    icon: Shield,
    title: "Pagamenti Sicuri",
    description: "Transazioni protette con crittografia SSL"
  },
  {
    icon: HeartHandshake,
    title: "Supporto Dedicato",
    description: "Il nostro team è sempre pronto ad aiutarti"
  },
  {
    icon: RotateCcw,
    title: "Reso Facile",
    description: "30 giorni per cambiare idea senza problemi"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-16 lg:py-20 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex p-4 rounded-xl bg-primary/20 text-primary mb-4">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="font-heading font-semibold text-background text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-background/70 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
