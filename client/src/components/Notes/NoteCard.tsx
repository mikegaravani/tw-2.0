import { MoreHorizontal, Star, Clock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface NoteCardProps {
  id: number;
  title: string;
  content: string;
  date: string;
  tags: string[];
  color: string;
  starred?: boolean;
}

export function NoteCard({
  id,
  title,
  content,
  date,
  tags,
  color,
  starred = false,
}: NoteCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow p-0 gap-0">
      <CardHeader className={`${color} p-4`}>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>

          <div className="flex items-center gap-1">
            {starred && (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <p className="text-sm whitespace-pre-line line-clamp-4">{content}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex gap-1">
          {tags.map((tag) => (
            <span key={tag} className="bg-muted px-2 py-1 rounded-md">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {date}
        </div>
      </CardFooter>
    </Card>
  );
}
