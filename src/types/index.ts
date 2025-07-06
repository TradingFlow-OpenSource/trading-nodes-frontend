
// TradingNodes Essential Types
export interface Position {
  x: number;
  y: number;
}

export interface NodeInput {
  id: string;
  value: any;
}

export interface NodeOutput {
  id: string;
  isDeleted: boolean;
}

export interface Node {
  id: string;
  type: string;
  position: Position;
  title?: string;
  description?: string;
  inputs?: NodeInput[];
  outputs?: NodeOutput[];
  data?: Record<string, any>;
  [key: string]: any;
}

export interface Edge {
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  [key: string]: any;
}

export interface FlowData {
  nodes: Node[];
  edges: Edge[];
}

// Supported node types (compatible with TradingFlow)
export type NodeType = 
  // Input Nodes
  | 'binance_price_node'
  | 'dataset_input_node'
  | 'rss_listener_node'
  | 'x_listener_node'
  // Compute Nodes
  | 'ai_model_node'
  | 'code_node'
  // Trade Nodes
  | 'swap_node'
  | 'buy_node'
  | 'sell_node'
  | 'vault_node'
  // Output Nodes
  | 'dataset_output_node'
  | 'telegram_sender_node'
  // Custom user-defined types
  | string;

export interface NodeDefinition {
  type: NodeType;
  description: string;
  category: 'input' | 'compute' | 'trade' | 'output' | 'custom';
  requiredInputs: string[];
  optionalInputs: string[];
  outputs: string[];
}

// Frontend binding structures
export interface Param {
  id: string;
  name: string;
  value: string;
}

export type NodeCollection = 'compute' | 'trade' | 'input' | 'output' | 'custom';

export type InputType =
  | 'none'
  | 'text'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'object'
  | 'paragraph'
  | 'address'
  | 'searchSelect'
  | 'paramMatrix'
  | 'radio'
  | 'radioGroup'
  | 'button'
  | 'array';

export interface TradingNode {
  id: string;
  name: string;
  description: string;
  category: NodeCollection;
  type: NodeType;
  version: string;
  author: string;
  authorId: string;
  price: number; // 0 for free
  rating: number;
  reviewCount: number;
  subscriptionCount: number;
  tags: string[];
  inputs: TFInput[];
  outputs: TFOutput[];
  icon?: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  executionMethod?: string;
  codeSnippet?: string;
}

export interface TFInput {
  id: string;
  title: string;
  tooltip?: string;
  type: InputType;
  inputType: InputType;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  value?: string | number | string[] | Param[];
  options?: Array<string | { 
    value: string; 
    label: string; 
    disabled?: boolean;
    tooltip?: string;
  }>;
  handle?: {
    color?: string;
  };
}

export interface TFOutput {
  id: string;
  title: string;
  type: InputType;
  description?: string;
  handle?: {
    color?: string;
  };
}

export interface Comment {
  id: string;
  content: string;
  rating?: number;
  author: string;
  authorId: string;
  createdAt: string;
  replies?: Comment[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

// Theme and language types
export type Theme = 'dark' | 'light';
export type Language = 'en' | 'zh';

export interface AppConfig {
  theme: Theme;
  language: Language;
}
