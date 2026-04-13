import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, ChefHat, ChevronDown, ChevronUp, Play } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const articles = [
  {
    id: 1,
    title: "The Gut-Brain Connection: What Science Says",
    category: "Research",
    categoryColor: "bg-indigo-100 text-indigo-700",
    content: [
      {
        key: "a1p1",
        text: "Your gut contains over 100 million neurons — more than your spinal cord. This 'second brain' (the enteric nervous system) communicates directly with your brain via the vagus nerve, influencing mood, stress response, and cognitive function.",
      },
      {
        key: "a1p2",
        text: "Studies show that 90% of serotonin — the neurotransmitter responsible for feelings of wellbeing — is produced in the gut, not the brain. When gut bacteria are out of balance, serotonin production suffers, contributing to anxiety and depression.",
      },
      {
        key: "a1p3",
        text: "Probiotic-rich foods like yogurt, kefir, kimchi, and sauerkraut have been shown in clinical trials to reduce symptoms of depression and anxiety within 4–8 weeks. A healthy microbiome is foundational to mental wellness.",
      },
    ],
  },
  {
    id: 2,
    title: "Omega-3 and Depression: A Clinical Overview",
    category: "Mental Health",
    categoryColor: "bg-blue-100 text-blue-700",
    content: [
      {
        key: "a2p1",
        text: "EPA and DHA, the omega-3 fatty acids found in fatty fish, walnuts, and flaxseed, are critical components of neuronal cell membranes. Deficiency is strongly linked to depression, bipolar disorder, and postpartum depression.",
      },
      {
        key: "a2p2",
        text: "A 2020 meta-analysis of 26 randomized controlled trials found that omega-3 supplementation significantly reduced depressive symptoms compared to placebo. The effect was strongest in patients with high omega-6 to omega-3 ratios.",
      },
      {
        key: "a2p3",
        text: "Aim for 2–3 servings of fatty fish per week (salmon, sardines, mackerel) or supplement with 1–2g EPA+DHA daily. Vegetarians can use algae-based omega-3 supplements, which deliver the same active compounds.",
      },
    ],
  },
  {
    id: 3,
    title: "Magnesium Deficiency and Anxiety",
    category: "Nutrition",
    categoryColor: "bg-emerald-100 text-emerald-700",
    content: [
      {
        key: "a3p1",
        text: "Magnesium is involved in over 300 biochemical reactions in the body, including regulation of the HPA axis — your body's central stress response system. Low magnesium amplifies the stress response, making it harder to calm down.",
      },
      {
        key: "a3p2",
        text: "Up to 68% of adults in developed countries don't meet the recommended daily intake of magnesium. Stress depletes magnesium further, creating a vicious cycle: anxiety drains magnesium, and low magnesium increases anxiety.",
      },
      {
        key: "a3p3",
        text: "Top food sources include dark leafy greens, pumpkin seeds, dark chocolate (70%+), almonds, black beans, and avocado. Magnesium glycinate is the most bioavailable supplement form with minimal digestive side effects.",
      },
    ],
  },
  {
    id: 4,
    title: "How B-Vitamins Fuel Your Brain",
    category: "Nutrition",
    categoryColor: "bg-emerald-100 text-emerald-700",
    content: [
      {
        key: "a4p1",
        text: "The B-vitamin family (B1, B2, B3, B5, B6, B7, B9, B12) collectively support energy metabolism, neurotransmitter synthesis, and myelin sheath integrity — the protective coating around nerve fibers.",
      },
      {
        key: "a4p2",
        text: "Vitamin B12 deficiency, common in vegans and the elderly, causes neurological symptoms including depression, memory problems, and fatigue. B6 is essential for serotonin, dopamine, and GABA synthesis.",
      },
      {
        key: "a4p3",
        text: "Eggs, meat, legumes, and fortified cereals are excellent B-vitamin sources. If you follow a plant-based diet, B12 supplementation is non-negotiable. A B-complex supplement helps fill gaps during high stress.",
      },
    ],
  },
  {
    id: 5,
    title: "Probiotics and Mental Health",
    category: "Research",
    categoryColor: "bg-indigo-100 text-indigo-700",
    content: [
      {
        key: "a5p1",
        text: "Psychobiotics are live bacterial cultures with demonstrable benefits for mental health. Research from Oxford and McMaster University shows specific strains of Lactobacillus and Bifidobacterium reduce anxiety and depressive symptoms.",
      },
      {
        key: "a5p2",
        text: "A 2019 landmark study found that participants who consumed fermented foods daily for 6 weeks showed measurable reductions in stress markers and improved cognitive flexibility.",
      },
      {
        key: "a5p3",
        text: "Beyond supplements, prioritize fermented foods: kefir, kombucha, miso, tempeh, and live-culture yogurt. Pair with prebiotic fiber from garlic, onions, leeks, asparagus, and bananas to feed beneficial bacteria.",
      },
    ],
  },
  {
    id: 6,
    title: "Sleep, Nutrition and Mental Recovery",
    category: "Sleep",
    categoryColor: "bg-purple-100 text-purple-700",
    content: [
      {
        key: "a6p1",
        text: "Melatonin, the sleep hormone, is synthesized from serotonin — which itself comes from tryptophan. Eating tryptophan-rich foods (turkey, eggs, pumpkin seeds) in the evening supports this conversion naturally.",
      },
      {
        key: "a6p2",
        text: "Magnesium activates the parasympathetic nervous system, helping you relax and fall asleep. Low magnesium is strongly associated with insomnia, restless leg syndrome, and poor sleep quality.",
      },
      {
        key: "a6p3",
        text: "Avoid caffeine after 2pm, high-sugar meals in the evening, and alcohol — which fragments REM sleep. For better sleep, eat complex carbs with dinner to raise brain tryptophan uptake across the blood-brain barrier.",
      },
    ],
  },
  {
    id: 7,
    title: "ADHD and Diet: What the Evidence Shows",
    category: "ADHD",
    categoryColor: "bg-orange-100 text-orange-700",
    content: [
      {
        key: "a7p1",
        text: "Omega-3 fatty acids (EPA and DHA) have shown moderate evidence for reducing ADHD symptoms in children and adults. Multiple meta-analyses report improvements in attention, hyperactivity, and impulsivity with 1–2g EPA+DHA daily.",
      },
      {
        key: "a7p2",
        text: "Iron and zinc deficiencies are disproportionately common in individuals with ADHD and are associated with dopamine dysregulation. Blood testing and targeted supplementation can meaningfully improve symptoms.",
      },
      {
        key: "a7p3",
        text: "Reducing processed sugar and refined carbohydrates helps stabilize blood glucose, which directly impacts attention and executive function. Protein-rich breakfasts (eggs, Greek yogurt, nuts) provide sustained dopamine precursors.",
      },
    ],
  },
  {
    id: 8,
    title: "Tryptophan: Your Brain's Serotonin Builder",
    category: "Neuroscience",
    categoryColor: "bg-pink-100 text-pink-700",
    content: [
      {
        key: "a8p1",
        text: "Tryptophan is an essential amino acid found in turkey, chicken, eggs, pumpkin seeds, tofu, and cheese. It is the sole dietary precursor for serotonin synthesis in the body and brain.",
      },
      {
        key: "a8p2",
        text: "Tryptophan crosses the blood-brain barrier more efficiently when consumed alongside carbohydrates — insulin clears competing amino acids from the bloodstream, giving tryptophan preferential access to the brain.",
      },
      {
        key: "a8p3",
        text: "Low tryptophan availability (as occurs during high-stress periods or restricted diets) is strongly associated with depressed mood and impaired memory. Aim for tryptophan-rich foods spread throughout the day.",
      },
    ],
  },
  {
    id: 9,
    title: "Anti-Inflammatory Eating for Mental Clarity",
    category: "Research",
    categoryColor: "bg-red-100 text-red-700",
    content: [
      {
        key: "a9p1",
        text: "Chronic low-grade inflammation is now considered a significant factor in depression and cognitive decline. Inflammatory cytokines cross the blood-brain barrier and directly impair serotonin and dopamine synthesis.",
      },
      {
        key: "a9p2",
        text: "Anti-inflammatory compounds found in turmeric (curcumin), ginger (gingerol), berries (anthocyanins), and olive oil (oleocanthal) suppress inflammatory pathways while supporting neuroplasticity.",
      },
      {
        key: "a9p3",
        text: "A Mediterranean-style diet — rich in fish, legumes, colorful vegetables, olive oil, and minimal processed foods — has the strongest evidence base for reducing depression risk and improving cognitive longevity.",
      },
    ],
  },
];

const videos = [
  {
    id: 1,
    title: "The Gut-Brain Connection Explained",
    expert: "Dr. Emily Deans",
    duration: "12 min",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    gradient: "from-indigo-400 to-purple-500",
  },
  {
    id: 2,
    title: "Omega-3 and Depression: Clinical Evidence",
    expert: "Dr. Andrew Huberman",
    duration: "18 min",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    id: 3,
    title: "Magnesium for Anxiety",
    expert: "Dr. Mark Hyman",
    duration: "9 min",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    id: 4,
    title: "Probiotics and Mood",
    expert: "Dr. Emeran Mayer",
    duration: "15 min",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    gradient: "from-violet-400 to-pink-500",
  },
];

const factCards = [
  {
    stat: "90%",
    desc: "of serotonin is produced in the gut",
    gradient: "from-indigo-500 to-indigo-700",
  },
  {
    stat: "68%",
    desc: "of adults are magnesium deficient",
    gradient: "from-emerald-500 to-emerald-700",
  },
  {
    stat: "2–3×",
    desc: "less depression risk with omega-3 rich diet",
    gradient: "from-blue-500 to-blue-700",
  },
  {
    stat: "40%",
    desc: "mood improvement from probiotic foods in 6 weeks",
    gradient: "from-violet-500 to-violet-700",
  },
  {
    stat: "4g",
    desc: "of omega-3 daily can reduce anxiety symptoms",
    gradient: "from-teal-500 to-teal-700",
  },
  {
    stat: "300+",
    desc: "body reactions require magnesium",
    gradient: "from-amber-500 to-amber-700",
  },
];

const recipes = [
  {
    name: "Brain-Boost Salmon Bowl",
    image: "/assets/generated/meal-salmon-quinoa.dim_400x300.jpg",
    nutrients: "Omega-3: 2.8g · Magnesium: 85mg · Calories: 520",
    description:
      "Grilled salmon over quinoa with avocado, spinach, and a lemon-tahini dressing. Rich in omega-3, B12, and folate.",
    tag: "Depression & Focus",
    tagColor: "bg-blue-100 text-blue-700",
    steps: [
      "Season salmon fillet with salt, pepper, lemon zest, and a drizzle of olive oil.",
      "Grill or pan-sear salmon over medium-high heat for 4 minutes per side until cooked through.",
      "Cook quinoa in vegetable broth for extra flavor; let cool slightly.",
      "Assemble bowl: quinoa base, flaked salmon, sliced avocado, fresh spinach, cucumber.",
      "Drizzle with lemon-tahini dressing (tahini, lemon juice, garlic, water) and top with sesame seeds.",
    ],
  },
  {
    name: "Calm Magnesium Plate",
    image: "/assets/generated/meal-magnesium-foods.dim_400x300.jpg",
    nutrients: "Omega-3: 1.2g · Magnesium: 180mg · Calories: 340",
    description:
      "Dark chocolate squares, roasted pumpkin seeds, wilted spinach with garlic and olive oil. Anxiety-reducing mineral powerhouse.",
    tag: "Anxiety Relief",
    tagColor: "bg-violet-100 text-violet-700",
    steps: [
      "Preheat oven to 350°F (175°C). Toss pumpkin seeds with olive oil, sea salt, and smoked paprika.",
      "Roast seeds on a baking sheet for 8–10 minutes until golden and fragrant.",
      "Wilt spinach in a skillet with 2 cloves minced garlic and a tablespoon of olive oil; season with nutmeg.",
      "Plate the spinach and top with roasted pumpkin seeds.",
      "Serve alongside 2–3 squares of 70%+ dark chocolate for a magnesium-rich meal.",
    ],
  },
  {
    name: "Focus Morning Spread",
    image: "/assets/generated/meal-brainfood-spread.dim_400x300.jpg",
    nutrients: "B-vitamins: High · Protein: 28g · Calories: 480",
    description:
      "Eggs benedict, walnut handful, blueberries, and avocado toast. Dopamine and serotonin precursors for mental clarity all morning.",
    tag: "ADHD & Focus",
    tagColor: "bg-amber-100 text-amber-700",
    steps: [
      "Toast whole grain sourdough slices until golden. Mash half an avocado with lemon juice and flaky salt.",
      "Poach eggs in simmering water with a splash of vinegar for 3 minutes for runny yolk.",
      "Spread avocado on toast; layer poached eggs and top with red pepper flakes.",
      "Serve with a small bowl of fresh blueberries and a handful of walnuts on the side.",
      "Optional: add smoked salmon on one slice for extra omega-3 and B12 boost.",
    ],
  },
  {
    name: "Gut-Brain Balance Bowl",
    image: "/assets/generated/meal-salmon-quinoa.dim_400x300.jpg",
    nutrients: "Probiotics: High · Fiber: 12g · Calories: 390",
    description:
      "Tempeh over brown rice with kimchi, roasted garlic sweet potato, and miso ginger dressing. Probiotic and prebiotic synergy.",
    tag: "Gut Health",
    tagColor: "bg-emerald-100 text-emerald-700",
    steps: [
      "Cube tempeh and marinate in tamari, garlic, and ginger for 15 minutes. Pan-fry until caramelized.",
      "Roast diced sweet potato at 400°F (200°C) with olive oil, cumin, and garlic for 25 minutes.",
      "Cook brown rice and fluff with a fork; keep warm.",
      "Whisk together miso paste, fresh ginger, rice vinegar, sesame oil, and a dash of maple syrup for the dressing.",
      "Assemble: rice base, tempeh, sweet potato, a spoonful of kimchi, and generous drizzle of miso ginger dressing.",
    ],
  },
];

export default function ResourcesPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [expandedRecipe, setExpandedRecipe] = useState<number | null>(null);

  return (
    <div className="px-4 py-5 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-display font-bold">Resources</h1>
        <p className="text-sm text-muted-foreground">
          Science-backed articles, videos and mood-enhancing recipes
        </p>
      </motion.div>

      {/* Fact Cards */}
      <section>
        <h2 className="text-lg font-display font-semibold mb-3">Key Facts</h2>
        <div
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
          data-ocid="resources.panel"
        >
          {factCards.map((card, i) => (
            <motion.div
              key={card.stat}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`flex-shrink-0 w-36 rounded-2xl bg-gradient-to-br ${card.gradient} p-4 text-white`}
              data-ocid={`resources.item.${i + 1}`}
            >
              <p className="text-3xl font-bold leading-none mb-1">
                {card.stat}
              </p>
              <p className="text-xs leading-snug opacity-90">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Articles */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-display font-semibold">
            Educational Articles
          </h2>
        </div>
        <div className="space-y-3">
          {articles.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              data-ocid={`resources.item.${i + 1}`}
            >
              <Card
                className="shadow-card cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setExpanded(expanded === a.id ? null : a.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">
                      {a.title}
                    </CardTitle>
                    <div className="flex items-center gap-1 shrink-0">
                      <Badge
                        className={`${a.categoryColor} text-xs`}
                        variant="secondary"
                      >
                        {a.category}
                      </Badge>
                      {expanded === a.id ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                {expanded === a.id && (
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {a.content.map((p) => (
                        <p
                          key={p.key}
                          className="text-sm text-muted-foreground leading-relaxed"
                        >
                          {p.text}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Video Resources */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Play className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-display font-semibold">
            Video Resources
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              data-ocid={`resources.item.${i + 1}`}
            >
              <Card className="shadow-card overflow-hidden">
                <div
                  className={`h-20 bg-gradient-to-br ${video.gradient} flex items-center justify-center`}
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Play className="h-5 w-5 text-white fill-white" />
                  </div>
                </div>
                <CardContent className="p-3 space-y-2">
                  <p className="text-xs font-semibold leading-snug line-clamp-2">
                    {video.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {video.expert}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {video.duration}
                    </span>
                    <Button
                      size="sm"
                      className="h-6 text-xs px-2"
                      onClick={() => window.open(video.url, "_blank")}
                      data-ocid="resources.button"
                    >
                      Watch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Recipes */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <ChefHat className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-display font-semibold">
            Mood-Enhancing Recipes
          </h2>
        </div>
        <div className="space-y-4">
          {recipes.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              data-ocid={`resources.item.${i + 1}`}
            >
              <Card className="shadow-card overflow-hidden">
                <img
                  src={r.image}
                  alt={r.name}
                  className="w-full h-40 object-cover"
                />
                <CardContent className="pt-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-base">{r.name}</h3>
                    <Badge
                      className={`${r.tagColor} text-xs shrink-0`}
                      variant="secondary"
                    >
                      {r.tag}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.nutrients}</p>
                  <p className="text-sm text-muted-foreground">
                    {r.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() =>
                      setExpandedRecipe(expandedRecipe === i ? null : i)
                    }
                    data-ocid="resources.button"
                  >
                    {expandedRecipe === i ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Hide Steps
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        View Steps
                      </>
                    )}
                  </Button>
                  {expandedRecipe === i && (
                    <motion.ol
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-2 pt-1"
                    >
                      {r.steps.map((step, si) => (
                        <li
                          key={step.slice(0, 20)}
                          className="flex gap-2 text-sm"
                        >
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                            {si + 1}
                          </span>
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </motion.ol>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="text-center text-xs text-muted-foreground pt-4 pb-2">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
