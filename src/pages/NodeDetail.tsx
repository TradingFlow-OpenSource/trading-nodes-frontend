
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, User, Eye, MessageCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { TradingNode, Comment } from '@/types';

const mockNode: TradingNode = {
  id: '1',
  name: 'XXXX Quant Node',
  description: 'Advanced quantitative trading algorithm with machine learning capabilities. This node analyzes market data using sophisticated mathematical models to generate profitable trading signals.',
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
  inputs: [
    {
      id: 'input1',
      title: 'Price Data',
      type: 'object',
      inputType: 'object',
      required: true,
      handle: { color: '#8b5cf6' }
    },
    {
      id: 'input2',
      title: 'Volume Data',
      type: 'number',
      inputType: 'number',
      required: false,
      handle: { color: '#3b82f6' }
    }
  ],
  outputs: [
    {
      id: 'output1',
      title: 'Trading Signal',
      type: 'object',
      description: 'Buy/Sell signals with confidence scores',
      handle: { color: '#10b981' }
    },
    {
      id: 'output2',
      title: 'Risk Assessment',
      type: 'number',
      description: 'Risk level from 0-100',
      handle: { color: '#f59e0b' }
    }
  ],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  isPublic: true
};

const mockComments: Comment[] = [
  {
    id: '1',
    content: 'Excellent node! The signals are very accurate and have improved my trading performance significantly.',
    rating: 5,
    author: 'Caesar Lynch',
    authorId: 'caesar456',
    createdAt: '2024-01-10',
    replies: []
  }
];

export const NodeDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [node, setNode] = useState<TradingNode | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNode(mockNode);
      setComments(mockComments);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      rating: newRating,
      author: 'Current User',
      authorId: 'current123',
      createdAt: new Date().toISOString(),
      replies: []
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
    setNewRating(5);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!node) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Node not found</h1>
          <Link to="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/marketplace" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="node-card mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{node.name}</h1>
                  <div className="flex items-center space-x-4 text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{t('node.author')} {node.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>{t('node.version')} {node.version}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-lg mb-6">{node.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {node.tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Inputs</h3>
                  <div className="space-y-3">
                    {node.inputs.map(input => (
                      <div key={input.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: input.handle?.color || '#6b7280' }}
                        ></div>
                        <div>
                          <div className="font-medium">{input.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {input.type} {input.required && '(required)'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Outputs</h3>
                  <div className="space-y-3">
                    {node.outputs.map(output => (
                      <div key={output.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: output.handle?.color || '#6b7280' }}
                        ></div>
                        <div>
                          <div className="font-medium">{output.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {output.description || output.type}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="node-card">
              <h2 className="text-2xl font-bold mb-6">{t('node.comments')} ({comments.length})</h2>

              {/* Add Comment Form */}
              <div className="mb-8 p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-4">{t('node.comment.add')}</h3>
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm">Rating:</span>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setNewRating(star)}
                        className={`w-5 h-5 ${star <= newRating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        <Star className="w-full h-full fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience with this node..."
                  className="mb-4"
                />
                <Button onClick={handleSubmitComment}>
                  {t('node.comment.submit')}
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map(comment => (
                  <div key={comment.id} className="border-b border-border pb-6 last:border-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {comment.author[0]}
                        </div>
                        <div>
                          <div className="font-medium">{comment.author}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      {comment.rating && (
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= comment.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <p>{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="node-card sticky top-24">
              {/* Node Preview */}
              <div className="mb-6 p-4 bg-gradient-card rounded-lg">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded border border-white/30 mx-auto mb-2">
                    <div className="flex flex-col h-full p-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <div className="text-xs text-white">Input 1</div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <div className="text-xs text-white">Input 2</div>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="text-xs text-white">Output 1</div>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-white">Output 2</div>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Preview in Workflow Tool</div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t('node.rating')}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{node.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({node.reviewCount} {t('node.reviews')})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subscribers</span>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{node.subscriptionCount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-semibold text-primary text-lg">
                    {node.price === 0 ? t('node.price.free') : `$${node.price}`}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full btn-primary">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t('node.use')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
