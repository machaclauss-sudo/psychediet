import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "psychediet_admin_content";

interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
}

interface Recipe {
  id: string;
  name: string;
  tag: string;
  description: string;
  nutrients: string;
  steps: string;
}

interface ContentStore {
  articles: Article[];
  recipes: Recipe[];
}

const SEED: ContentStore = {
  articles: [
    {
      id: "a1",
      title: "The Gut-Brain Connection",
      category: "Research",
      content:
        "Your gut contains over 100 million neurons linked directly to your brain via the vagus nerve.",
    },
    {
      id: "a2",
      title: "Omega-3 and Mood",
      category: "Mental Health",
      content:
        "EPA and DHA support neuronal membranes and reduce inflammatory cytokines linked to depression.",
    },
  ],
  recipes: [
    {
      id: "r1",
      name: "Salmon Brain Bowl",
      tag: "Focus",
      description: "Grilled salmon over quinoa with avocado.",
      nutrients: "Omega-3: 2.8g, Cal: 520",
      steps: "1. Grill salmon\n2. Cook quinoa\n3. Assemble bowl",
    },
    {
      id: "r2",
      name: "Calm Magnesium Plate",
      tag: "Anxiety",
      description: "Dark chocolate, pumpkin seeds, wilted spinach.",
      nutrients: "Magnesium: 180mg, Cal: 340",
      steps: "1. Roast pumpkin seeds\n2. Wilt spinach\n3. Plate with chocolate",
    },
  ],
};

function loadContent(): ContentStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(raw);
  } catch {
    return SEED;
  }
}

function saveContent(data: ContentStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const ARTICLE_CATEGORIES = [
  "Research",
  "Mental Health",
  "Nutrition",
  "Sleep",
  "ADHD",
  "Neuroscience",
];
const RECIPE_TAGS = [
  "Focus",
  "Anxiety",
  "Depression",
  "Sleep",
  "Gut Health",
  "Energy",
];

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function AdminContentPage() {
  const [content, setContent] = useState<ContentStore>(loadContent);

  // Article form state
  const [articleDialog, setArticleDialog] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [aTitle, setATitle] = useState("");
  const [aCategory, setACategory] = useState("");
  const [aContent, setAContent] = useState("");

  // Recipe form state
  const [recipeDialog, setRecipeDialog] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [rName, setRName] = useState("");
  const [rTag, setRTag] = useState("");
  const [rDesc, setRDesc] = useState("");
  const [rNutrients, setRNutrients] = useState("");
  const [rSteps, setRSteps] = useState("");

  function openAddArticle() {
    setEditingArticle(null);
    setATitle("");
    setACategory("");
    setAContent("");
    setArticleDialog(true);
  }

  function openEditArticle(a: Article) {
    setEditingArticle(a);
    setATitle(a.title);
    setACategory(a.category);
    setAContent(a.content);
    setArticleDialog(true);
  }

  function saveArticle() {
    if (!aTitle.trim() || !aCategory) return;
    const updated = { ...content };
    if (editingArticle) {
      updated.articles = updated.articles.map((a) =>
        a.id === editingArticle.id
          ? { ...a, title: aTitle, category: aCategory, content: aContent }
          : a,
      );
      toast.success("Article updated");
    } else {
      updated.articles = [
        ...updated.articles,
        { id: genId(), title: aTitle, category: aCategory, content: aContent },
      ];
      toast.success("Article added");
    }
    saveContent(updated);
    setContent(updated);
    setArticleDialog(false);
  }

  function deleteArticle(id: string) {
    const updated = {
      ...content,
      articles: content.articles.filter((a) => a.id !== id),
    };
    saveContent(updated);
    setContent(updated);
    toast.success("Article deleted");
  }

  function openAddRecipe() {
    setEditingRecipe(null);
    setRName("");
    setRTag("");
    setRDesc("");
    setRNutrients("");
    setRSteps("");
    setRecipeDialog(true);
  }

  function openEditRecipe(r: Recipe) {
    setEditingRecipe(r);
    setRName(r.name);
    setRTag(r.tag);
    setRDesc(r.description);
    setRNutrients(r.nutrients);
    setRSteps(r.steps);
    setRecipeDialog(true);
  }

  function saveRecipe() {
    if (!rName.trim() || !rTag) return;
    const updated = { ...content };
    if (editingRecipe) {
      updated.recipes = updated.recipes.map((r) =>
        r.id === editingRecipe.id
          ? {
              ...r,
              name: rName,
              tag: rTag,
              description: rDesc,
              nutrients: rNutrients,
              steps: rSteps,
            }
          : r,
      );
      toast.success("Recipe updated");
    } else {
      updated.recipes = [
        ...updated.recipes,
        {
          id: genId(),
          name: rName,
          tag: rTag,
          description: rDesc,
          nutrients: rNutrients,
          steps: rSteps,
        },
      ];
      toast.success("Recipe added");
    }
    saveContent(updated);
    setContent(updated);
    setRecipeDialog(false);
  }

  function deleteRecipe(id: string) {
    const updated = {
      ...content,
      recipes: content.recipes.filter((r) => r.id !== id),
    };
    saveContent(updated);
    setContent(updated);
    toast.success("Recipe deleted");
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Content Management</h1>
        <p className="text-muted-foreground text-sm">
          Manage educational articles and recipes
        </p>
      </div>

      <Tabs defaultValue="articles">
        <TabsList data-ocid="admin-content.tab">
          <TabsTrigger value="articles" data-ocid="admin-content.articles_tab">
            Articles
          </TabsTrigger>
          <TabsTrigger value="recipes" data-ocid="admin-content.recipes_tab">
            Recipes
          </TabsTrigger>
        </TabsList>

        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {content.articles.length} articles
            </p>
            <Dialog open={articleDialog} onOpenChange={setArticleDialog}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  onClick={openAddArticle}
                  data-ocid="admin-content.open_modal_button"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Article
                </Button>
              </DialogTrigger>
              <DialogContent data-ocid="admin-content.dialog">
                <DialogHeader>
                  <DialogTitle>
                    {editingArticle ? "Edit Article" : "Add Article"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="article-title">Title</Label>
                    <Input
                      id="article-title"
                      value={aTitle}
                      onChange={(e) => setATitle(e.target.value)}
                      placeholder="Article title"
                      data-ocid="admin-content.input"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={aCategory} onValueChange={setACategory}>
                      <SelectTrigger data-ocid="admin-content.select">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {ARTICLE_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="article-content">Content</Label>
                    <Textarea
                      id="article-content"
                      value={aContent}
                      onChange={(e) => setAContent(e.target.value)}
                      placeholder="Article content..."
                      rows={4}
                      data-ocid="admin-content.textarea"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setArticleDialog(false)}
                    data-ocid="admin-content.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveArticle}
                    data-ocid="admin-content.save_button"
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Table data-ocid="admin-content.table">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {content.articles.map((a, i) => (
                <TableRow key={a.id} data-ocid={`admin-content.row.${i + 1}`}>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{a.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditArticle(a)}
                        data-ocid={`admin-content.edit_button.${i + 1}`}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteArticle(a.id)}
                        data-ocid={`admin-content.delete_button.${i + 1}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Recipes Tab */}
        <TabsContent value="recipes" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {content.recipes.length} recipes
            </p>
            <Dialog open={recipeDialog} onOpenChange={setRecipeDialog}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  onClick={openAddRecipe}
                  data-ocid="admin-content.open_modal_button"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Recipe
                </Button>
              </DialogTrigger>
              <DialogContent data-ocid="admin-content.dialog">
                <DialogHeader>
                  <DialogTitle>
                    {editingRecipe ? "Edit Recipe" : "Add Recipe"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="recipe-name">Name</Label>
                    <Input
                      id="recipe-name"
                      value={rName}
                      onChange={(e) => setRName(e.target.value)}
                      placeholder="Recipe name"
                      data-ocid="admin-content.input"
                    />
                  </div>
                  <div>
                    <Label>Tag</Label>
                    <Select value={rTag} onValueChange={setRTag}>
                      <SelectTrigger data-ocid="admin-content.select">
                        <SelectValue placeholder="Select tag" />
                      </SelectTrigger>
                      <SelectContent>
                        {RECIPE_TAGS.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="recipe-desc">Description</Label>
                    <Input
                      id="recipe-desc"
                      value={rDesc}
                      onChange={(e) => setRDesc(e.target.value)}
                      placeholder="Short description"
                      data-ocid="admin-content.input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="recipe-nutrients">Nutrients</Label>
                    <Input
                      id="recipe-nutrients"
                      value={rNutrients}
                      onChange={(e) => setRNutrients(e.target.value)}
                      placeholder="e.g. Omega-3: 2g, Cal: 400"
                      data-ocid="admin-content.input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="recipe-steps">Steps</Label>
                    <Textarea
                      id="recipe-steps"
                      value={rSteps}
                      onChange={(e) => setRSteps(e.target.value)}
                      placeholder="Step 1\nStep 2\n..."
                      rows={4}
                      data-ocid="admin-content.textarea"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setRecipeDialog(false)}
                    data-ocid="admin-content.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveRecipe}
                    data-ocid="admin-content.save_button"
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Table data-ocid="admin-content.table">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {content.recipes.map((r, i) => (
                <TableRow key={r.id} data-ocid={`admin-content.row.${i + 1}`}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{r.tag}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditRecipe(r)}
                        data-ocid={`admin-content.edit_button.${i + 1}`}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteRecipe(r.id)}
                        data-ocid={`admin-content.delete_button.${i + 1}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
