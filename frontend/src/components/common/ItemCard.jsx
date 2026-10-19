import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import Badge from './Badge';
import { formatDate, truncateText } from '../../utils/formatters';

export default function ItemCard({ item }) {
  const isLost = item.type === 'LOST';
  const hasImage = item.imageUrls && item.imageUrls.length > 0 && item.imageUrls[0];
  const imageUrl = hasImage ? item.imageUrls[0] : null;

  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 overflow-hidden">
      {/* Image / Thumbnail */}
      <div className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-4">
            <Tag className="w-10 h-10 mb-2 opacity-50" />
            <span className="text-xs font-medium uppercase tracking-wider">
              {item.category || 'Item'}
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge variant={isLost ? 'lost' : 'found'}>
            {isLost ? 'Lost Item' : 'Found Item'}
          </Badge>
          {item.status && item.status !== 'OPEN' && (
            <Badge variant={item.status.toLowerCase()}>
              {item.status.replace('_', ' ')}
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category */}
        <div className="flex items-center text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2">
          {item.category}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-1 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed flex-1">
          {truncateText(item.description, 100)}
        </p>

        {/* Metadata pills */}
        <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{formatDate(item.dateOccurred)}</span>
            {item.approximateTime && (
              <>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{item.approximateTime}</span>
              </>
            )}
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-4 pt-3">
          <Link
            to={`/items/${item.id}`}
            className="flex items-center justify-between w-full px-4 py-2 text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 hover:bg-primary-100 dark:hover:bg-primary-900/60 rounded-xl transition-colors group/btn"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
