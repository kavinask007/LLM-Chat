import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ProgressData {
  url: string;
  progress: number;
}

interface DownloadProgressNotificationProps {
  progress: ProgressData[];
  showdownloads: boolean;
  setDownloads: (downloads: boolean) => void;
}

export function DownloadProgressNotification({
  progress,
  showdownloads,
  setDownloads,
}: DownloadProgressNotificationProps) {
  return showdownloads ? (
    <Card className="fixed bottom-4 right-1 h-3/4 w-80 bg-background/80 backdrop-blur-sm z-50 ">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Notification</h2>
          <Button
            variant="default"
            className="rounded-full"
            size="icon"
            onClick={() => setDownloads(!showdownloads)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="h-3/4">
          <AnimatePresence>
            {progress.map((item) => (
              <motion.div
                key={item.url}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mb-4"
              >
                <div className="text-sm font-medium mb-1 truncate">
                  {item.url}
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={item.progress} className="w-[30%]" />
                  <span className="text-xs font-semibold">
                    {item.progress}%
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  ) : (
    <></>
  );
}
