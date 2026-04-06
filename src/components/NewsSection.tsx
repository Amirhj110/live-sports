'use client';

import { NewsArticle } from '@/types/match';
import { motion } from 'framer-motion';
import { ExternalLink, Clock, Newspaper } from 'lucide-react';

interface NewsSectionProps {
  articles: NewsArticle[];
}

export function NewsSection({ articles }: NewsSectionProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffHours < 48) return 'Yesterday';
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-bold text-white">Trending Now</h2>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No news articles available
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.slice(0, 6).map((article, index) => (
            <motion.a
              key={`news-${article.id}-${index}`}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group block bg-gradient-to-br from-white/10 to-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all"
            >
              {/* Image */}
              <div className="aspect-video bg-gray-800 relative overflow-hidden">
                {article.imageUrl ? (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <Newspaper className="w-12 h-12 text-gray-600" />
                  </div>
                )}
                
                {/* Source Badge */}
                {article.source && (
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                    {article.source}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-white line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h3>
                {article.description && (
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                    {article.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(article.publishedAt)}
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
