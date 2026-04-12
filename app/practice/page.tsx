'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  PlayCircle,
  BookOpen,
  Code2,
  Database,
  Cpu,
  Network,
  Wand2,
  FlaskConical,
  Shrink,
  Mic2,
  Rocket,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Target,
  FileCode,
  Lightbulb,
  Building2,
  Layers,
  Gauge,
  Boxes,
  Server,
  Terminal,
} from 'lucide-react';
import { useI18n } from '@/lib/hooks/use-i18n';
import { useTheme } from '@/lib/hooks/use-theme';
import { Button } from '@/components/ui/button';

// AI全流程阶段定义
const AI_STAGES = [
  {
    id: 'data-engineering',
    name: '数据工程',
    nameEn: 'Data Engineering',
    icon: Database,
    color: 'from-blue-500 to-cyan-500',
    description: '学习数据采集、清洗、标注、存储的全流程',
    theoryTopics: [
      '数据采集与来源',
      '数据清洗与预处理',
      '数据标注方法',
      '数据增强技术',
      '数据存储与管理',
      '数据质量评估',
    ],
    practice: {
      title: '实战：数据清洗与标注',
      description: '使用Python进行大规模文本/图像数据清洗，实践数据标注工具',
      frameworks: ['Pandas', 'NumPy', 'Label Studio', 'Doccano'],
      tasks: [
        '实现文本数据清洗pipeline',
        '构建图像数据标注流程',
        '使用OpenMAIC生成标注指南',
      ],
    },
  },
  {
    id: 'model-design',
    name: '模型设计',
    nameEn: 'Model Design',
    icon: Cpu,
    color: 'from-indigo-500 to-purple-500',
    description: '掌握神经网络架构设计原理与实践',
    theoryTopics: [
      '神经网络基础',
      'Transformer架构',
      '注意力机制',
      '模型架构搜索',
      '轻量化网络设计',
      '多模态模型设计',
    ],
    practice: {
      title: '实战：设计你的第一个模型',
      description: '从零实现一个精简的Transformer模型',
      frameworks: ['PyTorch', 'DeepSpeed', 'Megatron-LM'],
      tasks: [
        '实现Transformer编码器',
        '设计针对特定任务的头部',
        '使用OpenMAIC生成模型架构文档',
      ],
    },
  },
  {
    id: 'model-training',
    name: '模型训练',
    nameEn: 'Model Training',
    icon: Network,
    color: 'from-purple-500 to-pink-500',
    description: '深入理解分布式训练、混合精度、梯度优化',
    theoryTopics: [
      '梯度下降与优化器',
      '分布式训练策略',
      '混合精度训练',
      '梯度累积与checkpoint',
      '训练监控与调优',
      '分布式数据并行',
    ],
    practice: {
      title: '实战：分布式训练大模型',
      description: '在多GPU环境下训练亿级参数模型',
      frameworks: ['PyTorch DDP', 'DeepSpeed', 'FSDP', 'Accelerate'],
      tasks: [
        '配置分布式训练环境',
        '实现混合精度训练',
        '使用OpenMAIC生成训练报告',
      ],
    },
  },
  {
    id: 'fine-tuning',
    name: '模型微调',
    nameEn: 'Fine-tuning',
    icon: Wand2,
    color: 'from-pink-500 to-rose-500',
    description: '掌握LoRA、QLoRA、Adapter等高效微调技术',
    theoryTopics: [
      '全参数微调 vs 适配器微调',
      'LoRA原理与实现',
      'QLoRA与量化微调',
      'Prefix Tuning',
      'Prompt Tuning',
      '领域自适应微调',
    ],
    practice: {
      title: '实战：微调垂直领域模型',
      description: '使用LoRA技术微调专业领域大模型',
      frameworks: ['PEFT', 'LoRAX', 'Axolotl', 'Unsloth'],
      tasks: [
        '构建领域微调数据集',
        '配置LoRA微调参数',
        '使用OpenMAIC生成微调报告',
      ],
    },
  },
  {
    id: 'reinforcement-learning',
    name: '强化学习',
    nameEn: 'Reinforcement Learning',
    icon: FlaskConical,
    color: 'from-rose-500 to-orange-500',
    description: '学习RLHF、GRPO、DPO等人类反馈强化学习',
    theoryTopics: [
      '强化学习基础',
      'PPO算法详解',
      'RLHF流程',
      'GRPO原理',
      'DPO对齐技术',
      '奖励模型设计',
    ],
    practice: {
      title: '实战：RLHF对齐训练',
      description: '使用人类反馈提升模型质量',
      frameworks: ['TRL', 'DeepSpeed-Chat', 'OpenChat'],
      tasks: [
        '构建偏好数据集',
        '训练奖励模型',
        '使用OpenMAIC生成对齐报告',
      ],
    },
  },
  {
    id: 'model-compression',
    name: '模型压缩',
    nameEn: 'Model Compression',
    icon: Shrink,
    color: 'from-orange-500 to-amber-500',
    description: '掌握量化、剪枝等模型压缩技术',
    theoryTopics: [
      '模型量化基础',
      'PTQ后训练量化',
      'QAT量化感知训练',
      '模型剪枝技术',
      '知识蒸馏概述',
      '压缩效果评估',
    ],
    practice: {
      title: '实战：量化部署模型',
      description: '将大模型量化到可部署的尺寸',
      frameworks: ['llama.cpp', 'AWQ', 'GPTQ', 'TensorRT-LLM'],
      tasks: [
        '执行INT8/INT4量化',
        '验证量化后模型效果',
        '使用OpenMAIC生成压缩报告',
      ],
    },
  },
  {
    id: 'model-distillation',
    name: '模型蒸馏',
    nameEn: 'Model Distillation',
    icon: Mic2,
    color: 'from-amber-500 to-yellow-500',
    description: '利用大模型知识训练小模型',
    theoryTopics: [
      '知识蒸馏理论',
      'Teacher-Student架构',
      '中间层蒸馏',
      '特征蒸馏',
      '对抗蒸馏',
      '蒸馏策略选择',
    ],
    practice: {
      title: '实战：蒸馏小尺寸模型',
      description: '将大模型知识迁移到小模型',
      frameworks: [' Knowledge Distillation', 'MiniMax-M2', 'DistilBERT'],
      tasks: [
        '设计蒸馏策略',
        '训练学生模型',
        '使用OpenMAIC生成蒸馏报告',
      ],
    },
  },
  {
    id: 'inference-deployment',
    name: '推理部署',
    nameEn: 'Inference & Deployment',
    icon: Rocket,
    color: 'from-green-500 to-emerald-500',
    description: '掌握高效推理引擎与部署到生产环境',
    theoryTopics: [
      '推理优化基础',
      'vLLM推理引擎',
      'TensorRT部署',
      'API服务化',
      '边缘设备部署',
      '推理性能评估',
    ],
    practice: {
      title: '实战：部署3B/4B大模型推理服务',
      description: '使用vLLM部署高效推理服务',
      frameworks: ['vLLM', 'TensorRT-LLM', 'OpenAI API', 'FastAPI'],
      tasks: [
        '搭建vLLM推理服务',
        '配置3B/4B模型推理',
        '压力测试与性能优化',
        '使用OpenMAIC生成部署报告',
      ],
    },
  },
];

// 阶段卡片组件
function StageCard({
  stage,
  index,
  isActive,
  onClick,
}: {
  stage: (typeof AI_STAGES)[0];
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = stage.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl cursor-pointer transition-all
        border ${isActive ? 'border-ai-cyan/40' : 'border-transparent'}
        bg-white/80 dark:bg-space-800/60 backdrop-blur-sm
        hover:shadow-xl dark:hover:shadow-ai-cyan/10
        ${isActive ? 'ring-2 ring-ai-cyan/20' : ''}
      `}
    >
      {/* 背景渐变 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${stage.color} opacity-${isActive ? '20' : '5'}`} />
      
      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stage.color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        
        <h3 className="font-bold text-slate-800 dark:text-white mb-1">
          {stage.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
          {stage.description}
        </p>
        
        <div className="flex items-center gap-1 mt-3 text-xs text-ai-cyan dark:text-ai-cyan/80">
          <BookOpen className="w-3 h-3" />
          <span>{stage.theoryTopics.length} 个理论知识点</span>
          <span className="mx-1">•</span>
          <Code2 className="w-3 h-3" />
          <span>实战项目</span>
        </div>
      </div>
    </motion.div>
  );
}

// 阶段详情组件
function StageDetail({
  stage,
  onGenerateCourse,
}: {
  stage: (typeof AI_STAGES)[0];
  onGenerateCourse: (type: 'theory' | 'practice') => void;
}) {
  const [expanded, setExpanded] = useState<'theory' | 'practice' | null>('theory');
  const Icon = stage.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/90 dark:bg-space-800/80 backdrop-blur-xl rounded-2xl border border-ai-cyan/20 dark:border-ai-cyan/30 overflow-hidden"
    >
      {/* 头部 */}
      <div className={`bg-gradient-to-r ${stage.color} p-6`}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{stage.name}</h2>
            <p className="text-white/80 text-sm">{stage.nameEn}</p>
          </div>
        </div>
        <p className="mt-4 text-white/90">{stage.description}</p>
      </div>
      
      <div className="p-6">
        {/* 理论课程 */}
        <div className="mb-6">
          <button
            onClick={() => setExpanded(expanded === 'theory' ? null : 'theory')}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-blue-50 dark:bg-space-700/50 hover:bg-blue-100 dark:hover:bg-space-600/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-slate-800 dark:text-white">理论课程</span>
              <span className="text-xs text-slate-500">({stage.theoryTopics.length} 章节)</span>
            </div>
            {expanded === 'theory' ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          
          <AnimatePresence>
            {expanded === 'theory' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-2">
                  {stage.theoryTopics.map((topic, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-space-700/30"
                    >
                      <Circle className="w-3 h-3 text-blue-400 fill-blue-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{topic}</span>
                    </div>
                  ))}
                </div>
                
                <Button
                  onClick={() => onGenerateCourse('theory')}
                  className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  使用AI生成完整课程
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* 实战环节 */}
        <div>
          <button
            onClick={() => setExpanded(expanded === 'practice' ? null : 'practice')}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-green-50 dark:bg-space-700/50 hover:bg-green-100 dark:hover:bg-space-600/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Code2 className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-slate-800 dark:text-white">实战环节</span>
              <span className="text-xs text-slate-500">(框架 + 任务)</span>
            </div>
            {expanded === 'practice' ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          
          <AnimatePresence>
            {expanded === 'practice' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
                    {stage.practice.title}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {stage.practice.description}
                  </p>
                  
                  {/* 框架工具 */}
                  <div className="mb-4">
                    <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      推荐框架 & 工具
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {stage.practice.frameworks.map((fw, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-mono"
                        >
                          {fw}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* 任务列表 */}
                  <div>
                    <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      实战任务
                    </h5>
                    <div className="space-y-2">
                      {stage.practice.tasks.map((task, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-space-700/30"
                        >
                          <Target className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => onGenerateCourse('practice')}
                    className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    生成实战指导手册
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function PracticePage() {
  const { t } = useI18n();
  const router = useRouter();
  const { theme } = useTheme();
  const [activeStage, setActiveStage] = useState<number>(0);
  
  const handleGenerateCourse = async (type: 'theory' | 'practice') => {
    const stage = AI_STAGES[activeStage];
    let requirement: string;
    
    if (type === 'theory') {
      requirement = `生成一个关于"${stage.name}"的完整课程，包括：${stage.theoryTopics.join('、')}。要求课程内容深入浅出，包含理论讲解、代码示例和练习题。`;
    } else {
      requirement = `生成一个关于"${stage.name}"的实战项目指南，包括：${stage.practice.tasks.join('。')}。要求包含详细的步骤说明、代码实现和注意事项。推荐使用框架：${stage.practice.frameworks.join('、')}。`;
    }
    
    // 保存到sessionStorage并跳转到课程生成页面
    const { nanoid } = await import('nanoid');
    const sessionState = {
      sessionId: nanoid(),
      requirements: {
        requirement,
        language: 'zh-CN' as const,
      },
      pdfText: '',
      pdfImages: [],
      imageStorageIds: [],
      pdfStorageKey: undefined,
      pdfFileName: undefined,
      pdfProviderId: undefined,
      pdfProviderConfig: undefined,
      sceneOutlines: null,
      currentStep: 'generating' as const,
    };
    sessionStorage.setItem('generationSession', JSON.stringify(sessionState));
    router.push('/generation-preview');
  };
  
  const currentStage = AI_STAGES[activeStage];
  
  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-100 dark:from-space-900 dark:via-[#050d1f] dark:to-space-800 flex flex-col">
      {/* 背景效果 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none dark:block">
        <div
          className="absolute -top-[10%] left-[10%] w-[600px] h-[600px] opacity-100 rounded-full blur-3xl animate-[nebula-drift_20s_ease-in-out_infinite]"
          style={{
            background: 'radial-gradient(circle, oklch(0.18 0.06 260 / 40%) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-[30%] -right-[5%] w-[500px] h-[500px] opacity-100 rounded-full blur-3xl animate-[nebula-drift_25s_ease-in-out_infinite_reverse]"
          style={{
            background: 'radial-gradient(circle, oklch(0.16 0.055 290 / 30%) 0%, transparent 70%)',
            animationDelay: '-5s',
          }}
        />
      </div>
      
      {/* Header */}
      <div className="relative z-20 px-4 py-4 flex items-center justify-between border-b border-slate-200/50 dark:border-ai-cyan/10 bg-white/50 dark:bg-space-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-space-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-ai-cyan" />
              AI实战全流程
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              从数据工程到推理部署的完整学习路径
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-ai-cyan/10 text-ai-cyan text-xs font-medium">
            {activeStage + 1} / {AI_STAGES.length}
          </div>
        </div>
      </div>
      
      {/* 进度条 */}
      <div className="relative z-20 h-1 bg-slate-200 dark:bg-space-700">
        <motion.div
          className="h-full bg-gradient-to-r from-ai-cyan to-ai-purple"
          initial={{ width: 0 }}
          animate={{ width: `${((activeStage + 1) / AI_STAGES.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* 主内容区 */}
      <div className="flex-1 relative z10 overflow-hidden">
        <div className="h-full flex flex-col lg:flex-row">
          {/* 左侧阶段列表 */}
          <div className="w-full lg:w-[480px] p-4 lg:p-6 overflow-y-auto border-r border-slate-200/50 dark:border-ai-cyan/10 bg-white/30 dark:bg-space-800/30">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
              学习阶段
            </h2>
            <div className="space-y-3">
              {AI_STAGES.map((stage, idx) => (
                <StageCard
                  key={stage.id}
                  stage={stage}
                  index={idx}
                  isActive={activeStage === idx}
                  onClick={() => setActiveStage(idx)}
                />
              ))}
            </div>
            
            {/* 导航按钮 */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200/50 dark:border-ai-cyan/10">
              <Button
                variant="outline"
                onClick={() => setActiveStage(Math.max(0, activeStage - 1))}
                disabled={activeStage === 0}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                上一阶段
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveStage(Math.min(AI_STAGES.length - 1, activeStage + 1))}
                disabled={activeStage === AI_STAGES.length - 1}
                className="gap-2"
              >
                下一阶段
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* 右侧详情区 */}
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
            <StageDetail
              stage={currentStage}
              onGenerateCourse={handleGenerateCourse}
            />
            
            {/* 底部导航 */}
            <div className="mt-6 flex items-center justify-between">
              {activeStage > 0 ? (
                <Button
                  variant="ghost"
                  onClick={() => setActiveStage(activeStage - 1)}
                  className="gap-2 text-slate-500"
                >
                  <ArrowLeft className="w-4 h-4" />
                  返回上一阶段
                </Button>
              ) : (
                <div />
              )}
              
              {activeStage < AI_STAGES.length - 1 ? (
                <Button
                  onClick={() => setActiveStage(activeStage + 1)}
                  className="bg-gradient-to-r from-ai-cyan to-ai-blue hover:from-ai-cyan/80 hover:to-ai-blue/80 text-white gap-2"
                >
                  进入下一阶段
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => handleGenerateCourse('theory')}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white gap-2"
                >
                  <Zap className="w-4 h-4" />
                  完成全部阶段！
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}