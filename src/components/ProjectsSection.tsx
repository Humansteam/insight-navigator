import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MoreHorizontal, ChevronRight, ChevronLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Project {
  id: string;
  name: string;
  screenshot?: string;
  avatar: string;
  viewedAt: string;
  isFavorite?: boolean;
  badge?: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Insight Navigator',
    screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    viewedAt: '15 minutes ago',
  },
  {
    id: '2',
    name: 'Strata Navigator',
    screenshot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
    viewedAt: '6 hours ago',
  },
  {
    id: '3',
    name: 'Pixel Perfect Copy',
    screenshot: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=450&fit=crop',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
    viewedAt: '9 hours ago',
  },
  {
    id: '4',
    name: 'Easy Translator',
    screenshot: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4',
    viewedAt: '17 hours ago',
  },
  {
    id: '5',
    name: 'Noesis AI Insights',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5',
    viewedAt: '2 days ago',
    badge: 'Chat',
  },
  {
    id: '6',
    name: 'NLP Cognitive Translator',
    screenshot: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user6',
    viewedAt: '6 days ago',
  },
  {
    id: '7',
    name: 'Research Dashboard',
    screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user7',
    viewedAt: '1 week ago',
  },
  {
    id: '8',
    name: 'Data Analytics Hub',
    screenshot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user8',
    viewedAt: '1 week ago',
  },
  {
    id: '9',
    name: 'AI Assistant Pro',
    screenshot: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=450&fit=crop',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user9',
    viewedAt: '2 weeks ago',
  },
  {
    id: '10',
    name: 'Document Manager',
    screenshot: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user10',
    viewedAt: '2 weeks ago',
  },
  {
    id: '11',
    name: 'Knowledge Base',
    screenshot: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user11',
    viewedAt: '3 weeks ago',
  },
  {
    id: '12',
    name: 'API Explorer',
    screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user12',
    viewedAt: '1 month ago',
  },
];

const ProjectCard = ({ project }: { project: Project }) => {
  const [isFavorite, setIsFavorite] = useState(project.isFavorite || false);

  return (
    <div className="group relative flex flex-col w-full">
      {/* Thumbnail */}
      <div className="relative mb-3 flex flex-col">
        <Link
          to={`/projects/${project.id}`}
          className="group relative aspect-video w-full overflow-hidden rounded-xl bg-muted"
        >
          <div className="relative h-full w-full">
            {project.screenshot ? (
              <img
                src={project.screenshot}
                alt={`Screenshot of ${project.name}`}
                className="rounded-xl border border-black/5 dark:border-white/10 absolute inset-0 w-full h-full object-cover object-top"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-black/5 dark:border-white/10 bg-background">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 12 13"
                  className="w-8 h-8 text-muted-foreground/50"
                >
                  <path
                    fill="currentcolor"
                    fillRule="evenodd"
                    d="M3.6.39C5.59.39 7.202 2.006 7.202 4v1.372H8.4c1.989 0 3.601 1.616 3.601 3.61a3.605 3.605 0 0 1-3.6 3.61H0V4A3.605 3.605 0 0 1 3.6.39"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            {/* Favorite button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsFavorite(!isFavorite);
              }}
              className="absolute right-2 top-2 z-[5] flex h-8 w-8 items-center justify-center rounded-md bg-muted/80 backdrop-blur-sm transition-all duration-200 hover:bg-muted opacity-0 group-hover:opacity-100"
              aria-label="Add to favorites"
            >
              <Star
                className={`w-5 h-5 transition-all duration-200 ${
                  isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-foreground/80'
                }`}
              />
            </button>
          </div>
        </Link>

        {/* Badge */}
        {project.badge && (
          <div className="pointer-events-none absolute bottom-0 left-0 p-2">
            <span className="inline-flex items-center text-center rounded-sm font-medium px-1.5 py-0.5 bg-secondary text-secondary-foreground text-xs opacity-50">
              {project.badge}
            </span>
          </div>
        )}
      </div>

      {/* Project info */}
      <div className="flex items-center gap-2">
        <Link to={`/users/${project.id}`} className="transition-opacity hover:opacity-80">
          <span className="relative flex overflow-hidden rounded-full shrink-0 items-center h-9 w-9">
            <img
              src={project.avatar}
              alt="User avatar"
              className="h-full w-full aspect-auto object-cover"
            />
          </span>
        </Link>

        <div className="flex w-full min-w-0 items-center justify-between">
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-2 truncate">
              <p className="overflow-hidden truncate whitespace-nowrap text-foreground">
                {project.name}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <p>Viewed {project.viewedAt}</p>
            </div>
          </div>

          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium h-7 px-1 rounded-md py-1 aspect-square transition-opacity hover:bg-muted hover:text-foreground opacity-0 group-hover:opacity-100"
            type="button"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProjectsSection = ({ variant = 'page' }: { variant?: 'page' | 'dock' }) => {
  const isDock = variant === 'dock';

  return (
    <div
      className={
        isDock
          ? "rounded-3xl bg-card/95 border border-border shadow-lg"
          : "mb-12 rounded-3xl bg-card/95 pt-6"
      }
    >
      <Tabs defaultValue="recently" className={isDock ? "relative max-h-[38vh] overflow-auto" : "relative"}>
        {/* Header with tabs */}
        <div className="relative mb-5 flex items-center justify-between gap-2 px-4 md:px-8">
          {/* Left arrow (hidden by default) */}
          <div className="absolute top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center transition-opacity duration-200 -left-0.5 md:left-1 opacity-0">
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* Right arrow (hidden by default) */}
          <div className="absolute top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center transition-opacity duration-200 -right-0.5 md:right-1 opacity-0">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="mx-auto flex w-full items-center justify-between gap-4 overflow-x-auto scrollbar-none md:mx-0 md:px-0">
            <TabsList className="inline-flex items-center w-max justify-start gap-1 py-4 md:w-fit md:gap-0 bg-transparent h-auto">
              <TabsTrigger
                value="recently"
                className="relative z-10 inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm leading-[calc(20/14)] transition-all data-[state=inactive]:text-muted-foreground data-[state=active]:bg-muted/70 data-[state=active]:border data-[state=active]:border-black/5 dark:data-[state=active]:border-white/10 rounded-lg data-[state=active]:shadow-none"
              >
                Recently viewed
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="relative z-10 inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm leading-[calc(20/14)] transition-all data-[state=inactive]:text-muted-foreground data-[state=active]:bg-muted/70 data-[state=active]:border data-[state=active]:border-black/5 dark:data-[state=active]:border-white/10 rounded-lg data-[state=active]:shadow-none"
              >
                My projects
              </TabsTrigger>
              <TabsTrigger
                value="templates"
                className="relative z-10 inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm leading-[calc(20/14)] transition-all data-[state=inactive]:text-muted-foreground data-[state=active]:bg-muted/70 data-[state=active]:border data-[state=active]:border-black/5 dark:data-[state=active]:border-white/10 rounded-lg data-[state=active]:shadow-none"
              >
                Templates
              </TabsTrigger>
            </TabsList>

            <Link
              to="/dashboard/projects"
              className="hidden items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground md:flex"
            >
              Browse all
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Recently viewed content */}
        <TabsContent value="recently" className="relative -mt-2">
          <div className="px-4 md:px-8 pb-8">
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {mockProjects.slice(0, 12).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* My projects content */}
        <TabsContent value="projects" className="relative -mt-2">
          <div className="px-4 md:px-8 pb-8">
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {mockProjects.slice(0, 4).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Templates content */}
        <TabsContent value="templates" className="relative -mt-2">
          <div className="px-6 md:px-12 pb-8 text-center py-12">
            <p className="text-muted-foreground">No templates available yet</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
