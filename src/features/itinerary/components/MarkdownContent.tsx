import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { 
  MapPin, 
  ExternalLink, 
  Paperclip 
} from 'lucide-react';

interface MarkdownContentProps {
  content: string;
}

export const MarkdownContent = ({ 
  content 
}: MarkdownContentProps) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  const links: { 
    text: string; 
    href: string; 
  }[] = [];
  
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    links.push({ 
      text: match[1], 
      href: match[2] 
    });
  }

  const displayContent = content
    .replace(linkRegex, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ ]{2,}/g, ' ')
    .trim();

  return (
    <div className="flex flex-col w-full min-w-0">
      {displayContent && (
        <div
          className="prose prose-sm dark:prose-invert max-w-none 
          prose-p:leading-relaxed prose-p:mb-4 last:prose-p:mb-0
          prose-li:my-1 prose-headings:text-dark dark:prose-headings:text-white 
          prose-headings:font-black prose-headings:text-xs 
          prose-headings:uppercase prose-headings:opacity-70 
          prose-headings:mt-6 prose-headings:first:mt-0"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {displayContent}
          </ReactMarkdown>
        </div>
      )}

      {links.length > 0 && (
        <div className={
          displayContent 
            ? "mt-4 pt-4 border-t border-gray-100 dark:border-slate-800" 
            : ""
        }>
          <div className="flex items-center gap-2 mb-3 opacity-30">
            <Paperclip className="w-3 h-3" />
            
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Attachments
            </span>
          </div>
          
          <div className="space-y-2">
            {links.map((link, idx) => {
              const isMaps = link.href.includes('google.com/maps') ||
                link.href.includes('maps.app.goo.gl');

              const domain = link.href
                .replace(/^https?:\/\/(www\.)?/, '')
                .split('/')[0];

              return (
                <a
                  key={`${idx}-${link.href}`}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-4 px-4 py-3 
                    bg-gray-50 dark:bg-slate-800/40 border border-gray-200 
                    dark:border-slate-700 rounded-2xl no-underline 
                    transition-all active:scale-[0.99] active:bg-gray-100 
                    dark:active:bg-slate-800 w-full box-border group shadow-sm"
                >
                  <div className="p-2 bg-white dark:bg-slate-700 rounded-xl 
                    shadow-sm border border-gray-100 dark:border-slate-600 
                    text-primary shrink-0">
                    {isMaps ? (
                      <MapPin className="w-3.5 h-3.5" />
                    ) : (
                      <ExternalLink className="w-3.5 h-3.5" />
                    )}
                  </div>
                  
                  <div className="flex flex-col min-w-0 flex-grow">
                    <div className="text-[13px] font-bold text-dark 
                      dark:text-white truncate leading-tight mb-0.5">
                      {link.text}
                    </div>
                    
                    <div className="text-[9px] font-black uppercase 
                      tracking-widest text-subtext opacity-40 truncate">
                      {isMaps ? 'Google Maps' : domain}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
