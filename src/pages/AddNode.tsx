
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Minus, Eye, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TFInput, TFOutput, NodeCollection, InputType } from '@/types';
import { toast } from '@/hooks/use-toast';

const inputTypeOptions: { value: InputType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'select', label: 'Select' },
  { value: 'multiselect', label: 'Multi Select' },
  { value: 'object', label: 'Object' },
  { value: 'array', label: 'Array' },
  { value: 'paragraph', label: 'Paragraph' }
];

const categoryOptions: { value: NodeCollection; label: string }[] = [
  { value: 'input', label: 'Input' },
  { value: 'compute', label: 'Compute' },
  { value: 'trade', label: 'Trade' },
  { value: 'output', label: 'Output' }
];

export const AddNode = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'compute' as NodeCollection,
    type: '',
    version: 'v1.0',
    price: 0,
    tags: '' as string,
    executionMethod: '',
    codeSnippet: ''
  });

  const [inputs, setInputs] = useState<TFInput[]>([]);
  const [outputs, setOutputs] = useState<TFOutput[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      // Load existing node data for editing
      // This would be an API call in a real app
      setFormData({
        name: 'Existing Node',
        description: 'This is an existing node',
        category: 'compute',
        type: 'ai_model_node',
        version: 'v1.1',
        price: 29.99,
        tags: 'AI, Trading',
        executionMethod: 'api',
        codeSnippet: '// Example code'
      });
    }
  }, [isEditing]);

  const addInput = () => {
    const newInput: TFInput = {
      id: `input_${Date.now()}`,
      title: '',
      type: 'text',
      inputType: 'text',
      required: false,
      placeholder: ''
    };
    setInputs([...inputs, newInput]);
  };

  const removeInput = (index: number) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  const updateInput = (index: number, field: keyof TFInput, value: any) => {
    const updatedInputs = [...inputs];
    (updatedInputs[index] as any)[field] = value;
    setInputs(updatedInputs);
  };

  const addOutput = () => {
    const newOutput: TFOutput = {
      id: `output_${Date.now()}`,
      title: '',
      type: 'text',
      description: ''
    };
    setOutputs([...outputs, newOutput]);
  };

  const removeOutput = (index: number) => {
    setOutputs(outputs.filter((_, i) => i !== index));
  };

  const updateOutput = (index: number, field: keyof TFOutput, value: any) => {
    const updatedOutputs = [...outputs];
    (updatedOutputs[index] as any)[field] = value;
    setOutputs(updatedOutputs);
  };

  const handleSubmit = async (isDraft = false) => {
    setLoading(true);

    try {
      // Validate form
      if (!formData.name || !formData.description) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: isDraft ? "Draft Saved" : "Node Published",
        description: isDraft 
          ? "Your node has been saved as a draft." 
          : "Your node has been published successfully!",
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text">
            {isEditing ? t('edit.title') : t('add.title')}
          </h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {t('add.form.preview')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="node-card">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">{t('add.form.name')} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder={t('add.form.name.placeholder')}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="version">{t('add.form.version')}</Label>
                    <Input
                      id="version"
                      value={formData.version}
                      onChange={(e) => setFormData({...formData, version: e.target.value})}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">{t('add.form.description')} *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder={t('add.form.description.placeholder')}
                    className="mt-2 min-h-20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="category">{t('add.form.category')}</Label>
                    <Select value={formData.category} onValueChange={(value: NodeCollection) => setFormData({...formData, category: value})}>
                      <SelectTrigger className="mt-2">
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
                  </div>

                  <div>
                    <Label htmlFor="type">{t('add.form.type')}</Label>
                    <Input
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      placeholder="e.g. ai_model_node"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">{t('add.form.price')}</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">{t('add.form.tags')}</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder={t('add.form.tags.placeholder')}
                    className="mt-2"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                      <Badge key={index} variant="outline">{tag.trim()}</Badge>
                    ))}
                  </div>
                </div>

                {/* Inputs Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-lg font-semibold">{t('add.form.inputs')}</Label>
                    <Button type="button" onClick={addInput} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      {t('add.form.add.input')}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {inputs.map((input, index) => (
                      <div key={input.id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Input {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeInput(index)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={input.title}
                              onChange={(e) => updateInput(index, 'title', e.target.value)}
                              placeholder="Input name"
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label>Type</Label>
                            <Select value={input.type} onValueChange={(value: InputType) => updateInput(index, 'type', value)}>
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {inputTypeOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Placeholder</Label>
                            <Input
                              value={input.placeholder || ''}
                              onChange={(e) => updateInput(index, 'placeholder', e.target.value)}
                              placeholder="Input placeholder"
                              className="mt-1"
                            />
                          </div>

                          <div className="flex items-center space-x-2 pt-6">
                            <input
                              type="checkbox"
                              id={`required-${index}`}
                              checked={input.required || false}
                              onChange={(e) => updateInput(index, 'required', e.target.checked)}
                            />
                            <Label htmlFor={`required-${index}`}>Required</Label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outputs Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-lg font-semibold">{t('add.form.outputs')}</Label>
                    <Button type="button" onClick={addOutput} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      {t('add.form.add.output')}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {outputs.map((output, index) => (
                      <div key={output.id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Output {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOutput(index)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={output.title}
                              onChange={(e) => updateOutput(index, 'title', e.target.value)}
                              placeholder="Output name"
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label>Type</Label>
                            <Select value={output.type} onValueChange={(value: InputType) => updateOutput(index, 'type', value)}>
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {inputTypeOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="md:col-span-2">
                            <Label>Description</Label>
                            <Input
                              value={output.description || ''}
                              onChange={(e) => updateOutput(index, 'description', e.target.value)}
                              placeholder="Output description"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Execution Method */}
                <div>
                  <Label htmlFor="execution">{t('add.form.execution')}</Label>
                  <Select value={formData.executionMethod} onValueChange={(value) => setFormData({...formData, executionMethod: value})}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select execution method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="api">API Call</SelectItem>
                      <SelectItem value="python">Python Script</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Code Snippet */}
                <div>
                  <Label htmlFor="code">{t('add.form.code')}</Label>
                  <Textarea
                    id="code"
                    value={formData.codeSnippet}
                    onChange={(e) => setFormData({...formData, codeSnippet: e.target.value})}
                    placeholder="// Enter your code here..."
                    className="mt-2 min-h-32 font-mono text-sm"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    onClick={() => handleSubmit(false)}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? (
                      <div className="loading-spinner w-4 h-4 mr-2"></div>
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    {t('add.form.publish')}
                  </Button>

                  <Button
                    onClick={() => handleSubmit(true)}
                    disabled={loading}
                    variant="outline"
                    className="btn-secondary"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {t('add.form.save.draft')}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Sidebar */}
          {showPreview && (
            <div className="lg:col-span-1">
              <div className="node-card sticky top-24">
                <h3 className="font-semibold text-lg mb-4">Node Preview</h3>
                
                <div className="p-4 bg-gradient-card rounded-lg mb-4">
                  <div className="w-full bg-white/20 rounded border border-white/30 p-3">
                    <div className="text-center mb-3">
                      <div className="text-sm text-white font-medium">{formData.name || 'Node Name'}</div>
                    </div>
                    
                    <div className="space-y-2">
                      {inputs.slice(0, 2).map((input, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                          <div className="text-xs text-white">{input.title || `Input ${index + 1}`}</div>
                        </div>
                      ))}
                      
                      <div className="border-t border-white/20 my-2 pt-2">
                        {outputs.slice(0, 2).map((output, index) => (
                          <div key={index} className="flex items-center justify-end">
                            <div className="text-xs text-white mr-2">{output.title || `Output ${index + 1}`}</div>
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="capitalize">{formData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Version:</span>
                    <span>{formData.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-semibold text-primary">
                      {formData.price === 0 ? 'Free' : `$${formData.price}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Inputs:</span>
                    <span>{inputs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Outputs:</span>
                    <span>{outputs.length}</span>
                  </div>
                </div>

                {formData.tags && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
