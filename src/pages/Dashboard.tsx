
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Eye, Trash2, BarChart3, DollarSign, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TradingNode } from '@/types';

const mockUserNodes: TradingNode[] = [
  {
    id: '1',
    name: 'My Custom Signal Generator',
    description: 'Personal trading signal generator with custom indicators',
    category: 'compute',
    type: 'code_node',
    version: 'v1.0',
    author: 'Current User',
    authorId: 'current123',
    price: 19.99,
    rating: 4.2,
    reviewCount: 8,
    subscriptionCount: 45,
    tags: ['Custom', 'Signals'],
    inputs: [],
    outputs: [],
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
    isPublic: true
  }
];

export const Dashboard = () => {
  const { t } = useTranslation();
  const [nodes, setNodes] = useState<TradingNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNodes(mockUserNodes);
      setLoading(false);
    }, 1000);
  }, []);

  const stats = {
    total: nodes.length,
    published: nodes.filter(n => n.isPublic).length,
    revenue: nodes.reduce((sum, n) => sum + (n.price * n.subscriptionCount), 0)
  };

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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text">
            {t('dashboard.title')}
          </h1>
          <Link to="/add">
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              {t('nav.add')}
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="node-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">{t('dashboard.stats.total')}</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="node-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">{t('dashboard.stats.published')}</p>
                <p className="text-2xl font-bold">{stats.published}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="node-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">{t('dashboard.stats.revenue')}</p>
                <p className="text-2xl font-bold">${stats.revenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Nodes List */}
        {nodes.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t('dashboard.empty')}</h2>
            <Link to="/add">
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                {t('dashboard.create')}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nodes.map((node) => (
              <div key={node.id} className="node-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{node.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {node.description}
                    </p>
                  </div>
                  <Badge variant={node.isPublic ? "default" : "secondary"}>
                    {node.isPublic ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {node.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-muted-foreground">
                    {node.subscriptionCount} subscribers
                  </div>
                  <div className="font-semibold text-primary">
                    {node.price === 0 ? 'Free' : `$${node.price}`}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link to={`/node/${node.id}`}>
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Link to={`/edit/${node.id}`}>
                    <Button size="sm" variant="ghost">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button size="sm" variant="ghost" className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
