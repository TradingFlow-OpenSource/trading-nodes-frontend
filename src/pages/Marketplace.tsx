
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Star, User, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TradingNode, NodeCollection } from '@/types';
import Output from '../../../TradingFlow/frontend/src/pages/flow/components/TFNode/components/Output';

// Mock data for demonstration
const mockNodes: TradingNode[] = [
  {
    id: '1',
    name: 'XXXX Quant Node',
    description: 'Advanced quantitative trading algorithm with machine learning capabilities',
    category: 'compute',
    type: 'ai_model_node',
    version: 'v0.4',
    author: 'Victor',
    authorId: 'victor123',
    price: 0,
    rating: 4.95,
    reviewCount: 30,
    subscriptionCount: 420,
    tags: ['Trading', 'Quant'],
    inputs: [],
    outputs: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    isPublic: true
  },
  {
    id: '2',
    name: 'Signal Generator Pro',
    description: 'Generate trading signals based on technical indicators and market sentiment',
    category: 'compute',
    type: 'code_node',
    version: 'v1.2',
    author: 'Caesar Lynch',
    authorId: 'caesar456',
    price: 29.99,
    rating: 4.7,
    reviewCount: 15,
    subscriptionCount: 180,
    tags: ['Signals', 'Technical Analysis'],
    inputs: [],
    outputs: [],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    isPublic: true
  }
];

export const Marketplace = () => {
  const { t } = useTranslation();
  const [nodes, setNodes] = useState<TradingNode[]>([]);
  const [filteredNodes, setFilteredNodes] = useState<TradingNode[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('latest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNodes(mockNodes);
      setFilteredNodes(mockNodes);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = nodes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(node => 
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(node => node.category === categoryFilter);
    }

    // Sort results
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.subscriptionCount - a.subscriptionCount);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'latest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    setFilteredNodes(filtered);
  }, [nodes, searchTerm, categoryFilter, sortBy]);

  const categoryOptions = [
    { value: 'all', label: t('marketplace.filter.all') },
    { value: 'input', label: t('marketplace.filter.input') },
    { value: 'compute', label: t('marketplace.filter.compute') },
    { value: 'trade', label: t('marketplace.filter.trade') },
    { value: 'output', label: t('marketplace.filter.output') }
  ];

  const sortOptions = [
    { value: 'latest', label: t('marketplace.sort.latest') },
    { value: 'popular', label: t('marketplace.sort.popular') },
    { value: 'rating', label: t('marketplace.sort.rating') }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            {t('marketplace.title')}
          </h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder={t('marketplace.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Node Grid */}
        {filteredNodes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">{t('marketplace.empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNodes.map((node) => (
              <Link
                key={node.id}
                to={`/node/${node.id}`}
                className="block"
              >
                <div className="node-card h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{node.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {node.description}
                      </p>
                    </div>
                    
                    {/* Node Preview Icon */}
                    <div className="ml-4 p-3 bg-gradient-primary rounded-lg flex-shrink-0">
                      <div className="w-8 h-8 bg-white/20 rounded border border-white/30">
                        <div className="flex flex-col h-full p-1">
                          <div className="flex flex-col items-center mb-1">
                            <div className="text-xs text-white mb-1">Input</div>
                            <div className="text-xs text-white">Output</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{node.author}</span>
                    </div>
                    
                    <Badge variant="secondary">{node.version}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {node.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{node.rating}</span>
                        <span className="text-xs text-muted-foreground">
                          ({node.reviewCount})
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {node.subscriptionCount}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="font-semibold text-primary">
                        {node.price === 0 ? t('node.price.free') : `$${node.price}`}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
