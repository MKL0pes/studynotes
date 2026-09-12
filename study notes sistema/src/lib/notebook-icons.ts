import {
  // Acadêmico
  BookOpen, Book, BookMarked, GraduationCap, School, Library, Pencil, PenTool, Pen,
  NotebookPen, Notebook, FileText, ClipboardList, Microscope, Atom, FlaskConical, TestTube,
  Beaker, Calculator, Ruler, Compass, Sigma, Pi, Braces, Binary, Code, Code2, Terminal,
  // Organização
  Folder, FolderOpen, Archive, Layers, LayoutGrid, LayoutList, List, CheckSquare,
  ClipboardCheck, Calendar, CalendarDays, Clock, Timer, AlarmClock, Bell, BellRing,
  Bookmark, Tag, Tags, Hash, Flag, Star, Heart, Target, Trophy, Award, Medal, Crown,
  // Tecnologia
  Cpu, Database, Server, Cloud, CloudUpload, Globe, Wifi, Monitor, Laptop, Smartphone,
  Keyboard, Mouse, HardDrive, MemoryStick, CircuitBoard, Bot, BrainCircuit, Workflow,
  GitBranch, Github, Bug, Wrench,
  // Criativo
  Palette, Paintbrush, Brush, Camera, Image, Film, Music, Music2, Headphones, Mic,
  Radio, Tv, Video, Youtube, Clapperboard, Shapes, Triangle, Square, Circle, Hexagon,
  // Lifestyle
  Coffee, Pizza, Apple, Leaf, Flower, Sun, Moon, Umbrella, Mountain, Bike, Car, Plane,
  Rocket, Map, MapPin, Home, Building, Castle, Tent, Dumbbell, Activity, Smile, Zap,
  type LucideIcon,
} from "lucide-react";

export const NOTEBOOK_ICON_CATEGORIES: { name: string; icons: { name: string; component: LucideIcon }[] }[] = [
  {
    name: "Acadêmico",
    icons: [
      { name: "BookOpen", component: BookOpen }, { name: "Book", component: Book },
      { name: "BookMarked", component: BookMarked }, { name: "GraduationCap", component: GraduationCap },
      { name: "School", component: School }, { name: "Library", component: Library },
      { name: "Pencil", component: Pencil }, { name: "PenTool", component: PenTool },
      { name: "Pen", component: Pen }, { name: "NotebookPen", component: NotebookPen },
      { name: "Notebook", component: Notebook }, { name: "FileText", component: FileText },
      { name: "ClipboardList", component: ClipboardList }, { name: "Microscope", component: Microscope },
      { name: "Atom", component: Atom }, { name: "FlaskConical", component: FlaskConical },
      { name: "TestTube", component: TestTube }, { name: "Beaker", component: Beaker },
      { name: "Calculator", component: Calculator }, { name: "Ruler", component: Ruler },
      { name: "Compass", component: Compass }, { name: "Sigma", component: Sigma },
      { name: "Pi", component: Pi }, { name: "Braces", component: Braces },
      { name: "Binary", component: Binary }, { name: "Code", component: Code },
      { name: "Code2", component: Code2 }, { name: "Terminal", component: Terminal },
    ],
  },
  {
    name: "Organização",
    icons: [
      { name: "Folder", component: Folder }, { name: "FolderOpen", component: FolderOpen },
      { name: "Archive", component: Archive }, { name: "Layers", component: Layers },
      { name: "LayoutGrid", component: LayoutGrid }, { name: "LayoutList", component: LayoutList },
      { name: "List", component: List }, { name: "CheckSquare", component: CheckSquare },
      { name: "ClipboardCheck", component: ClipboardCheck }, { name: "Calendar", component: Calendar },
      { name: "CalendarDays", component: CalendarDays }, { name: "Clock", component: Clock },
      { name: "Timer", component: Timer }, { name: "AlarmClock", component: AlarmClock },
      { name: "Bell", component: Bell }, { name: "BellRing", component: BellRing },
      { name: "Bookmark", component: Bookmark }, { name: "Tag", component: Tag },
      { name: "Tags", component: Tags }, { name: "Hash", component: Hash },
      { name: "Flag", component: Flag }, { name: "Star", component: Star },
      { name: "Heart", component: Heart }, { name: "Target", component: Target },
      { name: "Trophy", component: Trophy }, { name: "Award", component: Award },
      { name: "Medal", component: Medal }, { name: "Crown", component: Crown },
    ],
  },
  {
    name: "Tecnologia",
    icons: [
      { name: "Cpu", component: Cpu }, { name: "Database", component: Database },
      { name: "Server", component: Server }, { name: "Cloud", component: Cloud },
      { name: "CloudUpload", component: CloudUpload }, { name: "Globe", component: Globe },
      { name: "Wifi", component: Wifi }, { name: "Monitor", component: Monitor },
      { name: "Laptop", component: Laptop }, { name: "Smartphone", component: Smartphone },
      { name: "Keyboard", component: Keyboard }, { name: "Mouse", component: Mouse },
      { name: "HardDrive", component: HardDrive }, { name: "MemoryStick", component: MemoryStick },
      { name: "CircuitBoard", component: CircuitBoard }, { name: "Bot", component: Bot },
      { name: "BrainCircuit", component: BrainCircuit }, { name: "Workflow", component: Workflow },
      { name: "GitBranch", component: GitBranch }, { name: "Github", component: Github },
      { name: "Bug", component: Bug }, { name: "Wrench", component: Wrench },
    ],
  },
  {
    name: "Criativo",
    icons: [
      { name: "Palette", component: Palette }, { name: "Paintbrush", component: Paintbrush },
      { name: "Brush", component: Brush }, { name: "Camera", component: Camera },
      { name: "Image", component: Image }, { name: "Film", component: Film },
      { name: "Music", component: Music }, { name: "Music2", component: Music2 },
      { name: "Headphones", component: Headphones }, { name: "Mic", component: Mic },
      { name: "Radio", component: Radio }, { name: "Tv", component: Tv },
      { name: "Video", component: Video }, { name: "Youtube", component: Youtube },
      { name: "Clapperboard", component: Clapperboard }, { name: "Shapes", component: Shapes },
      { name: "Triangle", component: Triangle }, { name: "Square", component: Square },
      { name: "Circle", component: Circle }, { name: "Hexagon", component: Hexagon },
    ],
  },
  {
    name: "Lifestyle",
    icons: [
      { name: "Coffee", component: Coffee }, { name: "Pizza", component: Pizza },
      { name: "Apple", component: Apple }, { name: "Leaf", component: Leaf },
      { name: "Flower", component: Flower }, { name: "Sun", component: Sun },
      { name: "Moon", component: Moon }, { name: "Umbrella", component: Umbrella },
      { name: "Mountain", component: Mountain }, { name: "Bike", component: Bike },
      { name: "Car", component: Car }, { name: "Plane", component: Plane },
      { name: "Rocket", component: Rocket }, { name: "Map", component: Map },
      { name: "MapPin", component: MapPin }, { name: "Home", component: Home },
      { name: "Building", component: Building }, { name: "Castle", component: Castle },
      { name: "Tent", component: Tent }, { name: "Dumbbell", component: Dumbbell },
      { name: "Activity", component: Activity }, { name: "Smile", component: Smile },
      { name: "Zap", component: Zap },
    ],
  },
];

export const NOTEBOOK_ICON_MAP: Record<string, LucideIcon> = NOTEBOOK_ICON_CATEGORIES.reduce(
  (acc, cat) => {
    cat.icons.forEach((i) => (acc[i.name] = i.component));
    return acc;
  },
  {} as Record<string, LucideIcon>,
);

export function getNotebookIcon(name?: string | null): LucideIcon {
  if (name && NOTEBOOK_ICON_MAP[name]) return NOTEBOOK_ICON_MAP[name];
  return BookOpen;
}
