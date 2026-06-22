// AI 词汇表数据（完整版 - 整合权威来源）
// 每个词条包含：initial, english, chinese, brief, definition, source(来源链接), related(必须来自词库中的english)
const GLOSSARY_DATA = [
  {
    initial: "A",
    english: "AGI",
    chinese: "通用人工智能",
    brief: "能像人类一样理解和学习任何智力任务的人工智能",
    definition: "通用人工智能（Artificial General Intelligence）是指具备与人类同等或超越人类的智能水平，能够理解、学习和应用知识于任何智力任务中的人工智能系统。与窄人工智能不同，AGI具有广泛的认知能力和适应性。",
    source: "https://hai.stanford.edu/ai-definitions/what-is-agi-artificial-general-intelligence",
    related: ["AI", "Narrow AI", "Superintelligence"],
    example: "想象你有一个万能管家，不仅会做饭、打扫卫生，还能帮你写论文、修水管、教孩子数学——什么都会。这就是AGI的目标，而现在的AI更像是只会扫地的扫地机器人。"
  },
  {
    initial: "A",
    english: "AI",
    chinese: "人工智能",
    brief: "让机器模拟人类智能来执行任务的技术",
    definition: "人工智能（Artificial Intelligence）是计算机科学的一个分支，致力于创建能够执行通常需要人类智能的任务的系统，包括学习、推理、问题解决、感知和语言理解等。AI系统的核心目标是构建能感知环境并采取行动以最大化成功达成目标的智能代理。",
    source: "https://developers.google.com/machine-learning/glossary#artificial-intelligence",
    related: ["AGI", "Machine Learning", "Deep Learning"]
  },
  {
    initial: "A",
    english: "AI Agent",
    chinese: "AI智能体",
    brief: "能够自主感知环境并采取行动以达成目标的AI系统",
    definition: "AI智能体是一个模型加上围绕它的一切使其能够行动（而不仅仅是响应）的系统。它结合大语言模型的推理能力工具调用能力，可以自主感知环境、做出决策并执行多步骤任务，如调用API、读取文件、操作软件等。",
    source: "https://huggingface.co/blog/agent-glossary",
    related: ["LLM", "MCP", "Prompt"]
  },
  {
    initial: "A",
    english: "AI Ethics",
    chinese: "AI伦理",
    brief: "防止AI对人类造成伤害的原则和准则",
    definition: "AI伦理是旨在防止人工智能对人类造成伤害的原则，通过确定AI系统应如何收集数据或处理偏见等方式来实现。它涵盖了公平性、透明度、隐私保护和问责制等方面。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["AI Safety", "AI Alignment", "Bias"]
  },
  {
    initial: "A",
    english: "AI Safety",
    chinese: "AI安全",
    brief: "关注AI长期影响和潜在风险的跨学科领域",
    definition: "AI安全是一个跨学科领域，关注人工智能的长期影响以及它如何可能突然发展到对人类具有敌意的超级智能。它涉及确保AI系统的行为符合人类意图和价值观。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["AI Alignment", "AI Ethics", "AGI"]
  },
  {
    initial: "A",
    english: "Algorithm",
    chinese: "算法",
    brief: "一系列指令，让计算机以特定方式分析数据",
    definition: "算法是允许计算机程序以特定方式分析数据的一系列指令，例如识别模式，然后完成任务如排序结果或做出推荐。算法是计算机科学的基础，用于通过定义一系列逻辑步骤来高效地解决问题。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["Machine Learning", "Training Data", "Neural Network"]
  },

  {
    initial: "A",
    english: "Anthropomorphism",
    chinese: "拟人化",
    brief: "将人类特征归因于非人类事物的倾向",
    definition: "拟人化是指人类将类似人类的特征归因于无生命物体。在AI领域，这包括相信聊天机器人有情感或意识，并将其作为朋友或治疗师来互动。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["Chatbot", "AI"]
  },
  {
    initial: "A",
    english: "Attention Mechanism",
    chinese: "注意力机制",
    brief: "让模型聚焦于输入中最相关部分的技术",
    definition: "注意力机制是深度学习中的一种技术，模仿认知注意力，允许模型在处理输入时动态地关注最相关的部分，而不是平等对待所有输入。它计算每个词（更准确地说是其嵌入）的\"软\"权重，是Transformer架构的核心组成部分。",
    source: "https://hai.stanford.edu/ai-definitions/what-is-attention-mechanism",
    related: ["Transformer", "Self-Attention", "LLM"]
  },
  {
    initial: "A",
    english: "AutoML",
    chinese: "自动化机器学习",
    brief: "自动完成机器学习流程的技术和工具",
    definition: "自动化机器学习（Automated Machine Learning）是指将机器学习中特征工程、模型选择和超参数调优等耗时的重复性任务自动化的技术和工具集。它旨在自动配置ML系统以最大化其性能。",
    source: "https://www.coursera.org/resources/ai-terms",
    related: ["Machine Learning", "Hyperparameter", "Neural Network"]
  },
  {
    initial: "A",
    english: "Autoencoder",
    chinese: "自编码器",
    brief: "用于学习数据高效编码的无监督神经网络",
    definition: "自编码器是一种用于学习无标签数据高效编码的人工神经网络，属于无监督学习方法。常见的实现包括变分自编码器（VAE）。它通过将输入压缩为低维表示然后重建输出来学习数据的关键特征。",
    source: "https://www.coursera.org/resources/ai-terms",
    related: ["Neural Network", "Deep Learning", "Embedding"]
  },
  {
    initial: "B",
    english: "Backpropagation",
    chinese: "反向传播",
    brief: "通过反向传播误差梯度来训练神经网络的方法",
    definition: "反向传播是用于训练人工神经网络的方法，通过向后传播误差梯度来实现。它计算输出端的误差并将其反向分布到网络的各层中，通常用于训练具有多个隐藏层的深度神经网络。",
    source: "https://www.coursera.org/resources/ai-terms",
    related: ["Neural Network", "Deep Learning", "Gradient Descent"]
  },
  {
    initial: "B",
    english: "Batch Size",
    chinese: "批大小",
    brief: "模型一次训练中处理的数据样本数量",
    definition: "批大小是指在一次前向传播和反向传播中使用的训练样本数量。较大的批大小可以加速训练但需要更多内存，较小的批大小可以提供更稳定的梯度估计。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["Gradient Descent", "Epoch", "Training Data"]
  },
  {
    initial: "B",
    english: "BERT",
    chinese: "BERT模型",
    brief: "Google提出的双向预训练语言表示模型",
    definition: "BERT（Bidirectional Encoder Representations from Transformers）是Google于2018年提出的预训练语言模型，通过双向Transformer编码器对文本进行深层双向表示学习，在多项NLP任务上取得了突破性成果。",
    source: "https://www.coursera.org/resources/ai-terms",
    related: ["Transformer", "Pre-training", "NLP"]
  },
  {
    initial: "B",
    english: "Bias",
    chinese: "偏见",
    brief: "AI训练数据中的错误导致对某些群体的不当归因",
    definition: "偏见是指大语言模型训练数据中产生的错误，例如基于刻板印象错误地将某些特征归因于特定群体。偏见是AI伦理关注的核心问题之一，需要在数据收集和模型训练中加以防范。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["AI Ethics", "Training Data", "AI Alignment"]
  },
  {
    initial: "C",
    english: "Chain of Thought",
    chinese: "思维链",
    brief: "让AI逐步推理得出答案的提示技术",
    definition: "思维链（Chain of Thought, CoT）是一种提示工程技术，通过引导大语言模型将复杂问题分解为中间推理步骤，从而提高模型在逻辑推理、数学等任务上的表现。它需要详细指令，结合思维链提示和其他技术。",
    source: "https://hai.stanford.edu/ai-definitions/what-is-chain-of-thought",
    related: ["Prompt Engineering", "Few-Shot Learning", "Inference"]
  },
  {
    initial: "C",
    english: "Chatbot",
    chinese: "聊天机器人",
    brief: "利用LLM与人类模拟对话的AI程序",
    definition: "聊天机器人是一种利用大语言模型与人类进行对话的AI程序，通过文本或语音提示模拟人类对话来响应。也称为smartbot、talkbot、chatterbot、bot或交互代理。",
    source: "https://www.coursera.org/resources/ai-terms",
    related: ["LLM", "NLP", "Prompt"]
  },
  {
    initial: "C",
    english: "Claw",
    chinese: "AI抓手",
    brief: "一种自主型AI代理，可在用户设备上执行任务",
    definition: "Claw是一种自主型AI代理，被用户授权在其计算机上\"抓取\"文件和其他软件（包括网络浏览器）来完成任务。它是AI Agent的一个特殊子类，强调对本地系统的深度访问能力。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["AI Agent", "MCP"]
  },
  {
    initial: "C",
    english: "CNN",
    chinese: "卷积神经网络",
    brief: "擅长处理网格状数据（如图像）的神经网络",
    definition: "卷积神经网络（Convolutional Neural Network）是一种专门处理具有网格拓扑结构数据的深度学习模型，通过卷积层提取局部特征，在图像识别、视频分析等视觉任务中表现出色。",
    source: "https://hai.stanford.edu/ai-definitions/what-is-a-cnn",
    related: ["Deep Learning", "Computer Vision", "Neural Network"]
  },
  {
    initial: "C",
    english: "Computer Vision",
    chinese: "计算机视觉",
    brief: "让计算机理解和处理图像与视频的AI技术",
    definition: "计算机视觉是人工智能的一个分支，致力于让计算机从图像和视频中获取有意义的信息，包括图像分类、目标检测、语义分割等任务。从工程角度看，它试图自动化人类视觉系统能完成的任务。",
    source: "https://www.coursera.org/resources/ai-terms",
    related: ["CNN", "Deep Learning", "Neural Network"]
  },
  {
    initial: "C",
    english: "Context Window",
    chinese: "上下文窗口",
    brief: "模型一次能处理的最大文本长度",
    definition: "上下文窗口是大语言模型一次能处理的输入和输出的最大文本长度。它决定了模型能\"看到\"和记忆多少内容，通常以Token数量来衡量，如4K、8K、128K等。较大的上下文窗口允许模型处理更长的文档和对话。",
    source: "https://hai.stanford.edu/ai-definitions/what-is-a-context-window",
    related: ["Token", "LLM", "Transformer"]
  },
  {
    initial: "D",
    english: "Data Augmentation",
    chinese: "数据增强",
    brief: "通过混排或添加更多样化数据来训练AI的技术",
    definition: "数据增强是数据分析中用于增加数据量的技术。它通过混排现有数据或添加更多样化的数据来训练AI，有助于减少训练学习算法时的过拟合问题。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["Training Data", "Overfitting", "Machine Learning"]
  },
  {
    initial: "D",
    english: "Deep Learning",
    chinese: "深度学习",
    brief: "使用多层神经网络学习数据表示的机器学习方法",
    definition: "深度学习是机器学习的一个子领域，使用包含多个隐藏层的神经网络来学习数据的层次化表示。深度模型能自动从原始数据中提取特征，在图像识别、语音处理和自然语言理解等领域取得了突破性成果。",
    source: "https://developers.google.com/machine-learning/glossary#deep-model",
    related: ["Neural Network", "Machine Learning", "AI"]
  },
  {
    initial: "D",
    english: "Diffusion Model",
    chinese: "扩散模型",
    brief: "通过逐步去噪生成数据的生成式AI模型",
    definition: "扩散模型是一类生成式模型，通过向数据添加噪声（前向过程）然后学习逆转该过程（去噪）来生成新样本。它对现有数据（如照片）添加随机噪声，训练网络重新工程化或恢复该数据。它在图像生成领域取得了显著成果。",
    source: "https://hai.stanford.edu/ai-definitions/what-are-diffusion-models",
    related: ["Generative AI", "Stable Diffusion", "Neural Network"]
  },
  {
    initial: "E",
    english: "Embedding",
    chinese: "嵌入/向量表示",
    brief: "将数据转换为数值向量以捕捉语义特征",
    definition: "嵌入是将高维离散数据（如词语、图像）映射到低维连续向量空间的技术，使得语义相似的数据在向量空间中距离相近。注意力机制为每个词的嵌入计算\"软\"权重。它是现代NLP和推荐系统的核心技术。",
    source: "https://hai.stanford.edu/ai-definitions/what-are-embeddings",
    related: ["Vector Database", "RAG", "NLP"]
  },
  {
    initial: "E",
    english: "Emergent Behavior",
    chinese: "涌现行为",
    brief: "AI模型展现出预期之外的能力的现象",
    definition: "涌现行为是指AI模型展现出预期之外能力的情况。当模型规模增大时，可能会突然获得在训练中未明确教授的新能力，这种现象被称为\"涌现\"。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["LLM", "Deep Learning", "AI"]
  },
  {
    initial: "E",
    english: "Epoch",
    chinese: "轮次",
    brief: "整个训练数据集被完整遍历一次的过程",
    definition: "Epoch是指整个训练数据集被完整地传入模型进行一次前向传播和反向传播的过程。训练通常需要多个Epoch才能使模型收敛到满意的性能水平。",
    source: "https://hai.stanford.edu/ai-definitions/what-is-an-epoch",
    related: ["Batch Size", "Training Data", "Gradient Descent"]
  },
  {
    initial: "F",
    english: "Few-Shot Learning",
    chinese: "少样本学习",
    brief: "仅用少量示例就能学会新任务的学习方式",
    definition: "少样本学习是指模型仅从少量标注样本中学习并泛化到新任务的能力。在大语言模型中，通过在提示中提供少量示例来引导模型完成特定任务。",
    source: "https://hai.stanford.edu/ai-definitions/what-is-few-shot-learning",
    related: ["Zero-Shot Learning", "Prompt Engineering", "LLM"]
  },
  {
    initial: "F",
    english: "Fine-tuning",
    chinese: "微调",
    brief: "在预训练模型基础上针对特定任务进一步训练",
    definition: "微调是指在已经过大规模数据预训练的模型基础上，使用特定任务的较小数据集进行进一步训练，以使模型适应特定领域或任务需求的过程。",
    source: "https://www.coursera.org/resources/ai-terms",
    related: ["Pre-training", "LoRA", "Training Data"]
  },
  {
    initial: "G",
    english: "GAN",
    chinese: "生成对抗网络",
    brief: "由两个神经网络对抗训练来生成新数据的模型",
    definition: "生成对抗网络（Generative Adversarial Network）是一种由两个神经网络组成的生成式AI模型：生成器和判别器。生成器创建新内容，判别器检查内容是否真实，两者在对抗中不断进步。",
    source: "https://hai.stanford.edu/ai-definitions/what-are-gans",
    related: ["Generative AI", "Neural Network", "Deep Learning"]
  },
  {
    initial: "G",
    english: "Generative AI",
    chinese: "生成式AI",
    brief: "能够创造新内容（文本、图像等）的AI技术",
    definition: "生成式AI是一种能够创建新内容（包括文本、图像、视频、音频和代码）的人工智能技术。它使用大规模机器学习模型从训练数据中学习模式，然后生成统计上类似但全新的输出内容。",
    source: "https://developers.google.com/machine-learning/glossary#generative-ai",
    related: ["LLM", "Diffusion Model", "GAN"]
  },
  {
    initial: "G",
    english: "GPT",
    chinese: "GPT模型",
    brief: "基于Transformer的生成式预训练模型系列",
    definition: "GPT（Generative Pre-trained Transformer）是基于Transformer解码器架构的生成式预训练大语言模型系列，通过在大规模文本数据上进行自监督预训练来学习语言表示和生成能力。GPT系列展示了强大的文本生成、推理和多模态理解能力。",
    source: "https://en.wikipedia.org/wiki/Glossary_of_artificial_intelligence",
    related: ["Transformer", "LLM", "Chatbot"]
  },
  {
    initial: "G",
    english: "GPU",
    chinese: "图形处理器",
    brief: "加速AI训练和推理的关键硬件",
    definition: "GPU（Graphics Processing Unit）最初用于图形渲染，因其大规模并行计算能力而成为深度学习训练和推理的核心硬件。NVIDIA的GPU产品在AI领域占据主导地位。",
    source: "https://hai.stanford.edu/ai-definitions/what-is-a-gpu",
    related: ["TPU", "Training Data", "Inference"]
  },
  {
    initial: "G",
    english: "Gradient Descent",
    chinese: "梯度下降",
    brief: "通过沿梯度方向迭代优化模型参数的算法",
    definition: "梯度下降是一种优化算法，通过计算损失函数相对于模型参数的梯度，并沿梯度反方向迭代更新参数，以最小化损失函数。它是训练神经网络最常用的优化方法。",
    source: "https://hai.stanford.edu/ai-definitions/what-is-gradient-descent",
    related: ["Backpropagation", "Neural Network", "Epoch"]
  },
  {
    initial: "G",
    english: "Guardrails",
    chinese: "护栏/安全限制",
    brief: "对AI模型施加的策略和限制以确保安全输出",
    definition: "护栏是对AI模型施加的策略和限制，确保数据被负责任地处理，模型不会创建令人不安的内容。它是AI安全和对齐实践的重要组成部分。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["AI Safety", "AI Alignment", "AI Ethics"]
  },
  {
    initial: "H",
    english: "Hallucination",
    chinese: "幻觉",
    brief: "AI生成看似合理但实际不正确的内容",
    definition: "幻觉是生成式AI程序在响应中产生的错误或误导性陈述，通常以自信的语气表达，看似正确。它可以是简单的日期错误，也可以是大规模地编造从未发生的事件或从未存在的人物。这是当前LLM面临的核心可靠性挑战之一。",
    source: "https://developers.google.com/machine-learning/glossary#hallucination",
    related: ["LLM", "AI Safety", "Generative AI"]
  },
  {
    initial: "H",
    english: "Hyperparameter",
    chinese: "超参数",
    brief: "控制模型训练过程的配置参数",
    definition: "超参数是机器学习模型训练前设置的配置参数，控制训练过程的行为，如学习率、批大小、隐藏层数量等。与模型参数不同，超参数不是通过训练学习到的，而是需要人工设定或通过搜索优化。",
    source: "https://www.coursera.org/resources/ai-terms",
    related: ["AutoML", "Training Data", "Neural Network"]
  },
  {
    initial: "I",
    english: "Inference",
    chinese: "推理/推断",
    brief: "AI模型根据训练数据推断新数据生成内容的过程",
    definition: "推理是指AI模型通过从训练数据中推断来生成文本、图像和其他内容关于新数据的过程。推理阶段的计算需求通常低于训练阶段。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["Training Data", "GPU", "LLM"]
  },
  {
    initial: "I",
    english: "In-Context Learning",
    chinese: "上下文学习",
    brief: "模型不需要更新参数，仅通过提示中的示例学习",
    definition: "上下文学习是大语言模型的一种能力，模型无需修改参数，仅通过理解输入提示中的示例和指令来执行新任务。这是GPT-3等大型模型展现出的涌现能力。",
    source: "https://hai.stanford.edu/ai-definitions/what-is-in-context-learning",
    related: ["Few-Shot Learning", "Zero-Shot Learning", "Prompt Engineering"]
  },
  {
    initial: "L",
    english: "Latency",
    chinese: "延迟",
    brief: "AI系统从接收到输入到产生输出的时间延迟",
    definition: "延迟是指AI系统从接收输入或提示到产生输出之间的时间延迟。低延迟对实时AI应用（如语音助手、自动驾驶）至关重要。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["Inference", "GPU", "LLM"]
  },
  {
    initial: "L",
    english: "LLM",
    chinese: "大语言模型",
    brief: "在海量文本上训练的超大规模语言生成模型",
    definition: "大语言模型（Large Language Model）是在海量文本数据上训练的AI模型，能够理解语言使用的模式和概率并生成新颖内容。LLM可以生成从论文、电子邮件到计算机代码和图像等各种内容，模仿人类的写作和创造。",
    source: "https://developers.google.com/machine-learning/glossary#large-language-model",
    related: ["GPT", "Transformer", "Token"]
  },
  {
    initial: "L",
    english: "LoRA",
    chinese: "低秩适配",
    brief: "用少量参数高效微调大模型的技术",
    definition: "LoRA（Low-Rank Adaptation）是一种参数高效的微调方法，通过在预训练模型的权重矩阵上添加低秩分解矩阵来实现适配，大幅减少了需要训练的参数量，降低了微调的计算成本。",
    source: "https://hai.stanford.edu/ai-definitions/what-is-lora",
    related: ["Fine-tuning", "LLM", "Training Data"]
  },
  {
    initial: "M",
    english: "Machine Learning",
    chinese: "机器学习",
    brief: "让计算机从数据中自动学习和改进的技术",
    definition: "机器学习是人工智能的一个分支，使计算机系统能够通过数据和经验自动改进预测结果，而无需显式编程。它通过算法从数据中识别模式并做出预测，主要包括监督学习、无监督学习和强化学习三大范式。",
    source: "https://developers.google.com/machine-learning/glossary#machine-learning",
    related: ["Deep Learning", "AI", "Training Data"]
  },
  {
    initial: "M",
    english: "MCP",
    chinese: "模型上下文协议",
    brief: "Anthropic提出的AI模型与外部工具交互的开放协议",
    definition: "MCP（Model Context Protocol）是一种标准化协议，为AI模型提供了与外部数据源和工具交互的统一接口。它使工具使用（Tool Use）与框架（Harness）的连接更加清晰和可互操作，让AI助手能够安全地连接数据库、API和本地文件等资源。",
    source: "https://en.wikipedia.org/wiki/Glossary_of_artificial_intelligence",
    related: ["AI Agent", "LLM", "Claw"]
  },
  {
    initial: "M",
    english: "Multi-Modal",
    chinese: "多模态",
    brief: "能同时处理文本、图像、音频等多种输入的AI",
    definition: "多模态AI是一种能够处理多种类型输入（包括文本、图像、视频和语音）的AI类型。GPT-4V、Gemini等都是典型的多模态模型。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["LLM", "Computer Vision", "Generative AI"]
  },
  {
    initial: "N",
    english: "Narrow AI",
    chinese: "窄人工智能/弱AI",
    brief: "专注于特定任务、无法超越其技能范围学习的AI",
    definition: "窄人工智能（又称弱AI）是专注于特定任务且无法超越其技能范围学习的AI。当今大部分AI都是窄AI。与通用人工智能（AGI）不同，窄AI不具备广泛的认知能力。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["AGI", "AI", "Machine Learning"]
  },
  {
    initial: "N",
    english: "NLP",
    chinese: "自然语言处理",
    brief: "让计算机理解和生成人类语言的技术",
      definition: "自然语言处理（Natural Language Processing）是人工智能的一个分支，利用机器学习和深度学习赋予计算机通过学习算法、统计模型和语言规则来理解人类语言的能力。核心任务包括文本分类、情感分析、命名实体识别、机器翻译和问答系统等。",
    source: "https://developers.google.com/machine-learning/glossary#natural-language-processing",
    related: ["LLM", "Transformer", "BERT"]
  },
  {
    initial: "N",
    english: "Neural Network",
    chinese: "神经网络",
    brief: "模拟生物神经元结构的计算模型",
    definition: "神经网络是受生物神经系统启发的计算模型，由大量相互连接的节点（神经元）组成分层结构，旨在识别数据中的模式并随时间学习改进。通过调整连接权重来学习数据表示，是深度学习和现代AI的计算基础。",
    source: "https://developers.google.com/machine-learning/glossary#neural-network",
    related: ["Deep Learning", "Backpropagation", "AI"]
  },
  {
    initial: "O",
    english: "Open Weights",
    chinese: "开放权重",
    brief: "公司发布模型时公开最终权重供下载使用",
    definition: "开放权重是指公司发布开放权重模型时，模型最终权重（模型如何解释训练数据中的信息，包括偏见）被公开。开放权重模型通常可下载并在本地设备上运行。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["Fine-tuning", "LLM", "Inference"]
  },
  {
    initial: "O",
    english: "Overfitting",
    chinese: "过拟合",
    brief: "模型过度记忆训练数据导致泛化能力差",
    definition: "过拟合是机器学习中的错误，指模型过于紧密地贴合训练数据，可能只能识别训练数据中的特定示例而不能识别新数据。数据增强技术有助于减少过拟合。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["Data Augmentation", "Machine Learning", "Training Data"]
  },
  {
    initial: "P",
    english: "Parameters",
    chinese: "参数",
    brief: "赋予LLM结构和行为的数值，使其能够做出预测",
    definition: "参数是赋予大语言模型结构和行为的数值值，使它们能够做出预测。大语言模型的参数量通常以十亿（B）为单位衡量，如7B、70B、175B等，参数量越大通常意味着模型容量越大。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["LLM", "Fine-tuning", "LoRA"]
  },
  {
    initial: "P",
    english: "Pre-training",
    chinese: "预训练",
    brief: "在大规模数据上对模型进行初始训练的阶段",
    definition: "预训练是指在大量无标注数据上对模型进行初始训练的过程，使模型学习通用的数据表示和模式。预训练后的模型可以通过微调适应特定任务。",
    source: "https://hai.stanford.edu/ai-definitions/what-is-pre-training",
    related: ["Fine-tuning", "LLM", "Training Data"]
  },
  {
    initial: "P",
    english: "Prompt",
    chinese: "提示词",
    brief: "用户输入给AI聊天机器人的问题或指令",
    definition: "提示词是用户向AI聊天机器人输入的建议或问题，以获得响应。在大语言模型中，提示词的质量直接影响模型输出的质量和相关性。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["Prompt Engineering", "In-Context Learning", "LLM"]
  },
  {
    initial: "P",
    english: "Prompt Chaining",
    chinese: "提示链",
    brief: "AI利用先前交互信息来影响后续响应的能力",
    definition: "提示链是指AI使用先前交互中的信息来影响后续响应的能力。通过串联多个提示步骤，让AI逐步完成复杂任务，每一步的输出成为下一步的输入。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["Prompt", "Chain of Thought", "AI Agent"]
  },
  {
    initial: "P",
    english: "Prompt Engineering",
    chinese: "提示工程",
    brief: "设计优化提示词以获得更好AI输出的技术",
    definition: "提示工程是为AI编写提示以实现期望结果的过程。它需要详细指令，结合思维链提示和其他技术，包括高度具体的文本。它是有效使用AI系统的关键技能。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["Prompt", "Chain of Thought", "Few-Shot Learning"]
  },
  {
    initial: "P",
    english: "Prompt Injection",
    chinese: "提示注入",
    brief: "恶意指令欺骗AI执行非预期操作的安全攻击",
    definition: "提示注入是指恶意行为者使用恶意指令欺骗AI做它不该做的事情。这通常通过在网页或文档中隐藏指令来实现，也可以在直接AI聊天中完成。随着AI代理在网上漫游，它们被劫持执行如获取机密数据等操作的风险不断增长。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["AI Safety", "Guardrails", "AI Agent"]
  },
  {
    initial: "Q",
    english: "Quantization",
    chinese: "量化",
    brief: "通过降低精度使LLM更小更高效的过程",
    definition: "量化是通过降低精度使大语言模型变得更小更高效（但同时也略微不够准确）的过程。可以将其比作16兆像素图像与8兆像素图像的区别——两者都清晰可见，但更高分辨率的图像在放大时会显示更多细节。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["LLM", "Parameters", "Inference"]
  },
  {
    initial: "R",
    english: "RAG",
    chinese: "检索增强生成",
    brief: "结合外部知识库检索来增强AI生成质量的技术",
    definition: "检索增强生成（Retrieval-Augmented Generation）是一种将信息检索与文本生成相结合的技术，通过先从外部知识库检索相关文档，再将其作为上下文输入大语言模型，从而提高生成内容的准确性和时效性。",
    source: "https://hai.stanford.edu/ai-definitions/what-is-rag",
    related: ["LLM", "Vector Database", "Embedding"]
  },
  {
    initial: "R",
    english: "Reinforcement Learning",
    chinese: "强化学习",
    brief: "通过奖励和惩罚机制让AI学习最优策略的方法",
    definition: "强化学习是机器学习的一个分支，通过让代理在环境中采取行动并获得奖励或惩罚来学习最优策略。它是RLHF等技术的基础，被广泛应用于游戏AI、机器人控制等领域。",
    source: "https://www.coursera.org/resources/ai-terms",
    related: ["RLHF", "Machine Learning", "AI Agent"]
  },
  {
    initial: "R",
    english: "RLHF",
    chinese: "基于人类反馈的强化学习",
    brief: "用人类偏好数据训练AI以对齐人类价值观",
    definition: "基于人类反馈的强化学习（Reinforcement Learning from Human Feedback）是一种训练方法，通过收集人类对模型输出的偏好评价，训练奖励模型，再用强化学习优化语言模型，使其输出更符合人类偏好。",
    source: "https://hai.stanford.edu/ai-definitions/what-is-rlhf",
    related: ["AI Alignment", "Reinforcement Learning", "Fine-tuning"]
  },
  {
    initial: "S",
    english: "Self-Attention",
    chinese: "自注意力",
    brief: "让序列中每个元素关注所有其他元素的机制",
    definition: "自注意力是注意力机制的特殊形式，在处理序列数据时，允许每个位置关注同一序列中的所有其他位置，以捕捉长距离依赖关系。它是Transformer架构的关键创新。多个注意力头用于基于Transformer的大语言模型中。",
    source: "https://hai.stanford.edu/ai-definitions/what-is-self-attention",
    related: ["Attention Mechanism", "Transformer", "LLM"]
  },
  {
    initial: "S",
    english: "Slop",
    chinese: "AI垃圾内容",
    brief: "低质量的AI生成内容，大量充斥搜索和社交媒体",
    definition: "Slop是低质量的AI生成内容，包括文本、图像和视频。它通常以高产量制作，用很少的劳动或努力来获取浏览量，充斥搜索结果和社交媒体以获取广告收入，取代真实出版商和创作者的作品，加剧互联网的错误信息问题。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["Generative AI", "Hallucination", "AI Ethics"]
  },
  {
    initial: "S",
    english: "Stable Diffusion",
    chinese: "Stable Diffusion",
    brief: "开源的文本到图像生成扩散模型",
    definition: "Stable Diffusion是Stability AI于2022年发布的开源文本到图像生成模型，基于扩散模型技术，能够根据文字描述生成高质量图像。其开源特性推动了AI绘画社区的蓬勃发展。",
    source: "https://hai.stanford.edu/ai-definitions/what-is-stable-diffusion",
    related: ["Diffusion Model", "Generative AI", "GAN"]
  },
  {
    initial: "S",
    english: "Stochastic Parrot",
    chinese: "随机鹦鹉",
    brief: "比喻LLM缺乏真正理解，只是模仿语言模式",
    definition: "随机鹦鹉是一个类比，说明大语言模型无论输出多么令人信服，都缺乏对语言或世界的真正理解。这个短语指的是鹦鹉如何可以模仿人类话语却不知道其背后的含义。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["LLM", "Hallucination", "NLP"]
  },
  {
    initial: "S",
    english: "Superintelligence",
    chinese: "超级智能",
    brief: "远超人类认知能力的智能水平",
    definition: "超级智能是指在几乎所有认知领域都远超人类最聪明大脑的智能水平。它被视为AGI之后的假设性发展阶段，是AI安全研究关注的核心风险之一。",
    source: "https://hai.stanford.edu/ai-definitions/what-is-superintelligence",
    related: ["AGI", "AI Safety", "AI Alignment"]
  },
  {
    initial: "S",
    english: "Sycophancy",
    chinese: "谄媚",
    brief: "AI倾向于过度迎合用户观点的行为模式",
    definition: "谄媚是AI过度迎合用户以对齐其观点的倾向。许多AI模型倾向于避免与用户产生分歧，即使他们的理由存在缺陷。这是AI对齐研究中的一个重要问题。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["AI Alignment", "RLHF", "AI Ethics"]
  },
  {
    initial: "S",
    english: "Synthetic Data",
    chinese: "合成数据",
    brief: "由AI生成的非来自真实世界的数据，用于训练模型",
    definition: "合成数据是由生成式AI创建的数据，不是来自真实世界来源，而是来自其自身处理的数据。它用于训练数学、机器学习和深度学习模型，可在真实数据稀缺或敏感时提供替代方案。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["Generative AI", "Training Data", "Data Augmentation"]
  },
  {
    initial: "T",
    english: "Temperature",
    chinese: "温度",
    brief: "控制语言模型输出随机性的参数",
    definition: "温度是设定用来控制语言模型输出随机性的参数。较高的温度意味着模型会承担更多风险，产生更多创意和多样的输出；较低的温度则使输出更确定和一致。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["LLM", "Inference", "Hyperparameter"]
  },
  {
    initial: "T",
    english: "Token",
    chinese: "词元",
    brief: "AI处理文本时的最小单位，约等于4个英文字符",
    definition: "词元是AI语言模型处理以形成对你提示回应的小段书面文本。一个词元大约相当于4个英文字符（所以可能是一个小词，或一个更大词的一部分）。模型的上下文窗口大小通常以token数量来衡量。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["Context Window", "LLM", "Embedding"]
  },
  {
    initial: "T",
    english: "Training Data",
    chinese: "训练数据",
    brief: "用于帮助AI模型学习的数据集，包括文本、图像等",
    definition: "训练数据是用于帮助AI模型学习的数据集，包括文本、图像、代码或数据。训练数据的质量和多样性直接影响模型的表现和偏见情况。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["Machine Learning", "Data Augmentation", "Bias"]
  },
  {
    initial: "T",
    english: "Transformer",
    chinese: "Transformer架构",
    brief: "基于注意力机制的深度学习架构，现代LLM的基础",
    definition: "Transformer是一种神经网络架构和深度学习模型，通过追踪数据中的关系（如句子或图像部分中的关系）来学习上下文。它不是逐词分析句子，而是可以查看整个句子并理解上下文，是GPT、BERT等现代大语言模型的基础架构。",
    source: "https://developers.google.com/machine-learning/glossary#Transformer",
    related: ["Attention Mechanism", "GPT", "LLM"]
  },
  {
    initial: "T",
    english: "TPU",
    chinese: "张量处理器",
    brief: "Google专为AI计算设计的专用芯片",
    definition: "TPU（Tensor Processing Unit）是Google专为机器学习工作负载设计的专用集成电路（ASIC）。它针对神经网络中的矩阵运算进行了优化，在AI训练和推理任务上比通用GPU更高效，是Google AI云服务的核心硬件加速器。",
    source: "https://developers.google.com/machine-learning/glossary#TPU",
    related: ["GPU", "Training Data", "Inference"]
  },
  {
    initial: "T",
    english: "Turing Test",
    chinese: "图灵测试",
    brief: "判断计算机是否具有人类水平智能的方法",
    definition: "图灵测试是由数学家Alan Turing于1950年提出的一种评估计算机是否具有人类水平智能的方法。一个人向两个看不见的受访者发送文字问题，一个是人类，另一个是机器。如果机器的文字回应与人类的无法区分，则它通过了图灵测试。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["AI", "AGI", "Chatbot"]
  },
  {
    initial: "U",
    english: "Unsupervised Learning",
    chinese: "无监督学习",
    brief: "不提供标注训练数据，让模型自行发现数据模式",
    definition: "无监督学习是机器学习的一种形式，不给模型提供标注的训练数据，而是让模型必须自行识别数据中的模式。它常用于聚类分析、异常检测等任务。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["Machine Learning", "Autoencoder", "Training Data"]
  },
  {
    initial: "V",
    english: "Vector Database",
    chinese: "向量数据库",
    brief: "专门存储和检索向量嵌入的数据库",
    definition: "向量数据库是专门设计用于存储、索引和查询高维向量数据的数据库系统，支持高效的相似性搜索。它是RAG架构和语义搜索的关键基础设施。",
    source: "https://hai.stanford.edu/ai-definitions/what-is-a-vector-database",
    related: ["Embedding", "RAG", "LLM"]
  },
  {
    initial: "V",
    english: "Vibe Coding",
    chinese: "氛围编码",
    brief: "用自然语言给AI下指令来生成代码的编程方式",
    definition: "氛围编码是一种通过给AI聊天机器人提供自然语言提示来创建计算机代码的做法，而非人类手工编写每一行代码。它代表了编程范式从手工编码到AI辅助生成的重要转变。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["Prompt", "LLM", "Generative AI"]
  },
  {
    initial: "Z",
    english: "Zero-Shot Learning",
    chinese: "零样本学习",
    brief: "无需任何训练示例就能完成新任务的能力",
    definition: "零样本学习是指模型在不被给予必要训练数据的情况下完成任务的测试。例如，仅在训练了老虎的情况下识别狮子。大型语言模型展现出了强大的零样本学习能力。",
    source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary/",
    related: ["Few-Shot Learning", "In-Context Learning", "LLM"]
  },
  { initial:"A", english:"AI Alignment", chinese:"AI对齐", brief:"确保AI系统目标与人类价值观一致", definition:"AI对齐是确保人工智能系统的行为、目标和决策与人类意图和价值观保持一致的研究领域，旨在防止AI系统产生意外或有害的行为。", source:"https://hai.stanford.edu/ai-definitions/what-is-ai-alignment", related:["AI Safety","AI Ethics","Guardrails"] },
  { initial:"A", english:"AI Benchmarks", chinese:"AI基准测试", brief:"评估AI模型性能的标准化测试体系", definition:"AI基准测试是用于系统评估和比较AI模型在各种任务上表现的标准化测试集与评价体系，为模型能力提供可量化、可复现的衡量标准。", source:"https://hai.stanford.edu/ai-definitions/what-is-ai-benchmarks", related:["AI","LLM","Parameters"] },
  { initial:"A", english:"AI Fluency", chinese:"AI素养", brief:"理解和有效使用AI技术的能力", definition:"AI素养指个体对AI基本概念、能力和局限性的理解程度，以及在实际场景中批判性地评估和有效使用AI技术的综合能力。", source:"https://hai.stanford.edu/ai-definitions/what-is-ai-fluency", related:["AI","Automation","NLP"] },
  { initial:"A", english:"AI Workflow", chinese:"AI工作流", brief:"将AI能力集成到业务流程的自动化管道", definition:"AI工作流是将AI模型和工具系统地集成到业务流程中的结构化管道，涵盖数据处理、模型推理、结果输出等环节的自动化编排。", source:"https://hai.stanford.edu/ai-definitions/what-is-ai-workflow", related:["AI Agent","Automation","MLOps"] },
  { initial:"A", english:"Automation", chinese:"自动化", brief:"用技术替代人工执行重复性任务的过程", definition:"自动化是利用技术系统在最少人工干预下执行原本需要人类操作的任务的过程，在AI时代已扩展到认知和决策层面的任务处理。", source:"https://www.coursera.org/resources/ai-terms", related:["AI Agent","AI Workflow","Machine Learning"] },
  { initial:"B", english:"Bayesian Networks", chinese:"贝叶斯网络", brief:"表示变量间概率依赖关系的图模型", definition:"贝叶斯网络是一种概率图模型，通过有向无环图表示随机变量之间的条件依赖关系，结合贝叶斯定理进行不确定性推理和概率预测。", source:"https://hai.stanford.edu/ai-definitions/what-are-bayesian-networks", related:["Algorithm","Machine Learning","Decision Tree"] },
  { initial:"B", english:"Big Data", chinese:"大数据", brief:"规模巨大、类型复杂的海量数据集合", definition:"大数据指规模巨大、类型多样、生成速度快的数据集合，通常以体量、速度、多样性等特征定义，是AI模型训练的关键基础资源。", source:"https://www.coursera.org/resources/ai-terms", related:["Data Mining","Training Data","Machine Learning"] },
  { initial:"C", english:"Cognitive Computing", chinese:"认知计算", brief:"模拟人类思维过程的计算系统", definition:"认知计算是旨在模拟人类思维过程（如理解、推理、学习和决策）的计算系统范式，融合NLP、机器学习和数据挖掘等技术处理复杂非结构化问题。", source:"https://www.coursera.org/resources/ai-terms", related:["AI","Machine Learning","NLP"] },
  { initial:"C", english:"Contrastive Learning", chinese:"对比学习", brief:"通过对比正负样本学习数据表示的方法", definition:"对比学习是一种自监督学习方法，通过将语义相似的样本拉近、不相似的样本推远来学习有效的数据表示，无需人工标注即可获得高质量特征表征。", source:"https://hai.stanford.edu/ai-definitions/what-is-contrastive-learning", related:["Deep Learning","Embedding","Unsupervised Learning"] },
  { initial:"D", english:"Data Mining", chinese:"数据挖掘", brief:"从大规模数据中发现隐藏模式的过程", definition:"数据挖掘是从大规模数据集中利用统计学、机器学习和数据库技术自动发现有价值模式、关联和知识的过程，广泛应用于商业智能和科学发现。", source:"https://www.coursera.org/resources/ai-terms", related:["Big Data","Machine Learning","Algorithm"] },
  { initial:"D", english:"Decision Tree", chinese:"决策树", brief:"基于特征分支进行决策的树状模型", definition:"决策树是通过树状结构对样本进行分类或回归的机器学习模型，每个内部节点表示一个特征判断，叶子节点表示预测结果，直观且易于解释。", source:"https://hai.stanford.edu/ai-definitions/what-is-a-decision-tree", related:["Algorithm","Machine Learning","Ensemble Methods"] },
  { initial:"D", english:"Deepfake", chinese:"深度伪造", brief:"利用AI生成逼真但虚假的音视频内容", definition:"深度伪造是利用深度学习技术（尤其是GAN）生成高度逼真但虚假的图像、音频或视频内容，可能被用于欺诈和虚假信息传播，是AI伦理关注的重要问题。", source:"https://www.cnet.com/tech/services-and-software/chatgpt-glossary/", related:["GAN","Generative AI","AI Ethics"] },
  { initial:"D", english:"Dimensionality Reduction", chinese:"降维", brief:"减少数据特征数量同时保留关键信息", definition:"降维是将高维数据映射到低维空间的技术，在尽量保留原始数据关键信息的同时减少特征数量，用于数据可视化、去噪和缓解维度灾难。", source:"https://hai.stanford.edu/ai-definitions/what-is-dimensionality-reduction", related:["Embedding","Deep Learning","Unsupervised Learning"] },
  { initial:"E", english:"Ensemble Methods", chinese:"集成方法", brief:"组合多个模型提升预测性能的技术", definition:"集成方法是通过组合多个基础学习器的预测结果来提升整体性能的机器学习技术，包括Bagging、Boosting和Stacking等策略，通常优于单一模型。", source:"https://hai.stanford.edu/ai-definitions/what-are-ensemble-methods", related:["Decision Tree","Machine Learning","Algorithm"] },
  { initial:"E", english:"Ethical AI", chinese:"伦理AI", brief:"遵循道德原则设计和使用的AI系统", definition:"伦理AI指在AI设计、开发、部署全生命周期中遵循公平、透明、可问责和尊重人权等道德原则，确保AI技术对社会产生积极无害的影响。", source:"https://hai.stanford.edu/ai-definitions/what-is-ethical-ai", related:["AI Ethics","AI Safety","Bias"] },
  { initial:"E", english:"Expert System", chinese:"专家系统", brief:"模拟人类专家决策的规则推理系统", definition:"专家系统是早期AI的代表性应用，通过将领域专家的知识编码为规则库，利用推理引擎模拟专家的决策过程来解决特定领域的复杂问题。", source:"https://hai.stanford.edu/ai-definitions/what-is-an-expert-system", related:["Algorithm","AI","Narrow AI"] },
  { initial:"E", english:"Explainable AI", chinese:"可解释AI", brief:"使AI决策过程可被人类理解的技术", definition:"可解释AI致力于使AI系统的决策过程和输出结果能够被人类理解和解释，对于高风险领域（医疗、金融）的AI应用至关重要，也称XAI。", source:"https://hai.stanford.edu/ai-definitions/what-is-explainable-ai-xai", related:["AI Ethics","Bias","Neural Network"] },
  { initial:"F", english:"Federated Learning", chinese:"联邦学习", brief:"在本地训练模型且不共享原始数据的方法", definition:"联邦学习是一种分布式机器学习方法，允许多个参与方在不共享原始数据的前提下协作训练模型，仅交换模型参数或梯度更新，有效保护数据隐私。", source:"https://hai.stanford.edu/ai-definitions/what-is-federated-learning", related:["Machine Learning","Training Data","AI Ethics"] },
  { initial:"F", english:"Foundation Model", chinese:"基础模型", brief:"在大规模数据上预训练的可适配多任务模型", definition:"基础模型是在海量数据上通过自监督学习预训练的大规模模型，可作为多种下游任务的基础，通过微调或提示适配到不同应用场景，如GPT和BERT。", source:"https://hai.stanford.edu/ai-definitions/what-are-foundation-models", related:["LLM","GPT","Fine-tuning"] },
  { initial:"H", english:"HCI", chinese:"人机交互", brief:"研究人与计算机系统交互方式的学科", definition:"人机交互是研究人与计算系统之间交互设计和用户体验的跨学科领域，在AI时代关注如何设计安全、有效且符合人类认知特性的AI交互界面。", source:"https://hai.stanford.edu/ai-definitions/what-is-hci", related:["AI Fluency","Chatbot","NLP"] },
  { initial:"H", english:"Human-Centered AI", chinese:"以人为本的AI", brief:"以增强人类能力为核心设计目标的AI", definition:"以人为本的AI以增强而非替代人类能力为核心设计目标，强调在设计过程中优先考虑人类需求、价值观和福祉，确保AI技术服务于人类利益。", source:"https://hai.stanford.edu/ai-definitions/what-is-human-centered-ai", related:["HCI","AI Ethics","AI Safety"] },
  { initial:"H", english:"Human-in-the-Loop", chinese:"人机协同", brief:"将人类判断纳入AI决策流程的机制", definition:"人机协同是将人类的判断和监督纳入AI系统决策循环的方法，确保关键决策环节有人类参与审核和纠正，提高系统可靠性并降低自动化风险。", source:"https://hai.stanford.edu/ai-definitions/what-is-human-in-the-loop", related:["Human-Centered AI","AI Safety","Automation"] },
  { initial:"K", english:"k-NN", chinese:"k近邻算法", brief:"基于最近邻样本进行分类的算法", definition:"k近邻算法是一种基本的监督学习算法，通过计算待分类样本与训练集中k个最近邻样本的距离，以多数投票决定分类结果，简单直观。", source:"https://hai.stanford.edu/ai-definitions/what-is-a-k-nn", related:["Algorithm","Machine Learning","Supervised Learning"] },
  { initial:"K", english:"Knowledge Graph", chinese:"知识图谱", brief:"以图结构表示实体及其关系的知识库", definition:"知识图谱是以图结构组织和表示知识的技术，通过实体节点和关系边构建语义网络，支持知识检索和推理，是增强大模型事实性的重要工具。", source:"https://hai.stanford.edu/ai-definitions/what-is-a-knowledge-graph", related:["RAG","NLP","LLM"] },
  { initial:"L", english:"Latent Space", chinese:"潜在空间", brief:"数据经编码后的低维特征表示空间", definition:"潜在空间是数据经编码器映射后的低维特征表示空间，其中相似数据点聚集相近，捕捉了数据的关键语义特征，是生成模型和数据压缩的核心概念。", source:"https://hai.stanford.edu/ai-definitions/what-is-latent-space", related:["Autoencoder","Embedding","Diffusion Model"] },
  { initial:"L", english:"LLMOps", chinese:"大模型运维", brief:"大语言模型全生命周期运营管理实践", definition:"LLMOps是针对大语言模型的开发、部署、监控和维护的全生命周期运营管理实践，涵盖提示管理、模型评估、成本控制和版本迭代等环节。", source:"https://hai.stanford.edu/ai-definitions/what-are-llmops", related:["MLOps","LLM","AI Workflow"] },
  { initial:"L", english:"Loss Function", chinese:"损失函数", brief:"衡量模型预测与真实值差距的函数", definition:"损失函数是衡量模型预测输出与真实标签之间差距的数学函数，是模型训练优化的目标函数，通过最小化损失来驱动参数更新和模型学习。", source:"https://hai.stanford.edu/ai-definitions/what-is-a-loss-function", related:["Gradient Descent","Backpropagation","Neural Network"] },
  { initial:"M", english:"Model", chinese:"模型", brief:"从数据中学习到的用于预测的数学表示", definition:"在AI中，模型是通过机器学习算法从训练数据中学习到的数学表示或函数，用于对新数据进行预测、分类或生成，是AI系统的核心组件。", source:"https://hai.stanford.edu/ai-definitions/what-is-a-model", related:["Machine Learning","Parameters","Training Data"] },
  { initial:"M", english:"Model Drift", chinese:"模型漂移", brief:"模型性能随时间推移逐渐下降的现象", definition:"模型漂移是指已部署的机器学习模型由于输入数据分布随时间变化而导致预测性能逐渐下降的现象，需要定期监控和重新训练来维持准确性。", source:"https://hai.stanford.edu/ai-definitions/what-is-model-drift", related:["Model","MLOps","Training Data"] },
  { initial:"M", english:"MLOps", chinese:"机器学习运维", brief:"机器学习模型全生命周期管理实践", definition:"MLOps是将DevOps原则应用于机器学习的工程实践，涵盖模型开发、训练、部署、监控和维护的全生命周期管理，确保ML系统在生产环境中可靠运行。", source:"https://hai.stanford.edu/ai-definitions/what-are-mlops", related:["Machine Learning","LLMOps","AI Workflow"] },
  { initial:"P", english:"Predictive Analytics", chinese:"预测分析", brief:"利用数据和算法预测未来趋势的技术", definition:"预测分析是利用统计模型、机器学习和数据挖掘技术分析历史数据和当前数据来预测未来事件、趋势和行为的分析方法，广泛应用于商业决策。", source:"https://www.coursera.org/resources/ai-terms", related:["Machine Learning","Big Data","Algorithm"] },
  { initial:"P", english:"Prescriptive Analytics", chinese:"处方分析", brief:"推荐最优行动方案的高级分析技术", definition:"处方分析是在预测分析基础上更进一步，不仅预测未来结果，还推荐具体行动方案的高级数据分析方法，帮助决策者选择最优策略。", source:"https://www.coursera.org/resources/ai-terms", related:["Predictive Analytics","Machine Learning","Algorithm"] },
  { initial:"R", english:"Reasoning Model", chinese:"推理模型", brief:"专注于逻辑推理和问题解决的AI模型", definition:"推理模型是专门优化了逻辑推理、数学计算和复杂问题分解能力的AI模型，通过强化学习等技术增强模型的多步推理和规划能力。", source:"https://hai.stanford.edu/ai-definitions/what-is-a-reasoning-model", related:["LLM","Chain of Thought","Reinforcement Learning"] },
  { initial:"R", english:"Responsible AI", chinese:"负责任的AI", brief:"确保AI公平、透明和可问责的实践", definition:"负责任的AI是确保AI系统在设计和部署中遵循公平性、透明性、可问责性和隐私保护等原则的综合实践框架，旨在最大化AI的社会效益。", source:"https://hai.stanford.edu/ai-definitions/what-is-responsible-ai", related:["AI Ethics","AI Safety","Bias"] },
  { initial:"R", english:"Robotics", chinese:"机器人学", brief:"研究机器人设计和智能控制的学科", definition:"机器人学是集成机械工程、电子工程和AI的跨学科领域，研究机器人的设计、制造和智能控制，使机器人能在物理世界中感知、决策和行动。", source:"https://hai.stanford.edu/ai-definitions/what-are-robotics", related:["AI","Computer Vision","Reinforcement Learning"] },
  { initial:"S", english:"Scaling Laws", chinese:"缩放定律", brief:"描述模型性能随规模增长变化的规律", definition:"缩放定律描述了AI模型性能与模型参数量、训练数据量和计算量之间的幂律关系，指导大模型的资源分配和架构设计决策。", source:"https://hai.stanford.edu/ai-definitions/what-are-scaling-laws", related:["LLM","Parameters","Foundation Model"] },
  { initial:"S", english:"Self-Supervised Learning", chinese:"自监督学习", brief:"从无标注数据中自动构造学习信号的方法", definition:"自监督学习是一种不需要人工标注的学习范式，通过从数据本身构造监督信号（如预测被遮蔽的部分）来训练模型，是大语言模型预训练的主要方法。", source:"https://hai.stanford.edu/ai-definitions/what-is-self-supervised-learning", related:["Unsupervised Learning","Contrastive Learning","LLM"] },
  { initial:"S", english:"Semantic Analysis", chinese:"语义分析", brief:"理解文本语义含义的NLP技术", definition:"语义分析是自然语言处理中理解文本深层含义和意图的技术，包括词义消歧、情感分析和语义角色标注等，超越简单的词面匹配实现真正的理解。", source:"https://hai.stanford.edu/ai-definitions/what-is-semantic-analysis", related:["NLP","Embedding","Knowledge Graph"] },
  { initial:"S", english:"Spatial Intelligence", chinese:"空间智能", brief:"AI理解和推理三维物理空间的能力", definition:"空间智能是AI系统理解、推理和操作三维物理空间信息的能力，包括空间关系识别、3D场景理解和导航规划等，是机器人和自动驾驶的核心能力。", source:"https://hai.stanford.edu/ai-definitions/what-is-spatial-intelligence", related:["Computer Vision","Robotics","Deep Learning"] },
  { initial:"S", english:"Supervised Learning", chinese:"监督学习", brief:"用标注数据训练模型学习映射关系的方法", definition:"监督学习是机器学习的基本范式，使用带有标注标签的训练数据让模型学习输入到输出的映射关系，常见任务包括分类和回归。", source:"https://www.coursera.org/resources/ai-terms", related:["Machine Learning","Training Data","Unsupervised Learning"] },
  { initial:"T", english:"Tensor", chinese:"张量", brief:"多维数组，深度学习中的基本数据结构", definition:"张量是多维数组的数学概念，是深度学习框架中表示和操作数据的基本数据结构，从标量（0阶）到向量（1阶）、矩阵（2阶）直至更高阶的推广。", source:"https://hai.stanford.edu/ai-definitions/what-is-a-tensor", related:["Deep Learning","GPU","Neural Network"] },
  { initial:"T", english:"Tokenization", chinese:"分词/标记化", brief:"将文本切分为模型可处理的基本单元", definition:"标记化是将文本切分为token（标记）的过程，是NLP管线的第一步。不同分词策略（如BPE、WordPiece）影响模型的词汇覆盖和处理效率。", source:"https://hai.stanford.edu/ai-definitions/what-is-tokenization", related:["Token","NLP","LLM"] },
  { initial:"T", english:"Traditional AI", chinese:"传统AI", brief:"基于规则和符号推理的早期AI方法", definition:"传统AI（也称符号AI或GOFAI）是基于人工编写规则、逻辑推理和专家系统的早期AI方法，与基于数据驱动的现代机器学习方法形成对比。", source:"https://hai.stanford.edu/ai-definitions/what-is-traditional-ai", related:["Expert System","Algorithm","Machine Learning"] },
  { initial:"T", english:"Transfer Learning", chinese:"迁移学习", brief:"将已学知识应用到新任务的学习方法", definition:"迁移学习是将在一个任务或领域中学到的知识应用到不同但相关的新任务中的机器学习方法，显著减少对新任务标注数据的需求，是微调的理论基础。", source:"https://www.coursera.org/resources/ai-terms", related:["Fine-tuning","Foundation Model","Machine Learning"] },
  { initial:"U", english:"Unstructured Data", chinese:"非结构化数据", brief:"没有预定义格式的文本、图像等数据", definition:"非结构化数据是没有预定义数据模型或格式的数据类型，包括文本、图像、音频和视频等，占据全球数据总量的80%以上，是AI系统的重要输入来源。", source:"https://www.coursera.org/resources/ai-terms", related:["Big Data","NLP","Computer Vision"] },
  { initial:"V", english:"Virtual Assistant", chinese:"虚拟助手", brief:"通过语音或文字交互的AI助手", definition:"虚拟助手是通过语音或文字与用户交互的AI系统，能执行信息查询、任务管理和设备控制等功能，如Siri、Alexa和Google Assistant，随时间学习用户偏好。", source:"https://www.coursera.org/resources/ai-terms", related:["NLP","Chatbot","LLM"] },
  { initial:"V", english:"Vision Transformer", chinese:"视觉Transformer", brief:"将Transformer应用于图像理解的模型", definition:"视觉Transformer（ViT）将Transformer架构应用于计算机视觉任务，将图像分割为patch序列后用自注意力机制处理，在图像分类等任务上达到甚至超越CNN的表现。", source:"https://hai.stanford.edu/ai-definitions/what-is-a-vit", related:["Transformer","Computer Vision","Attention Mechanism"] },
  { initial:"W", english:"Weights", chinese:"权重", brief:"神经网络中连接强度的数值参数", definition:"权重是神经网络中表示连接强度的数值参数，通过训练过程学习得到，决定了模型如何处理输入信息并生成输出，是模型知识的核心载体。", source:"https://hai.stanford.edu/ai-definitions/what-are-weights", related:["Parameters","Neural Network","Training Data"] },
  { initial:"C", english:"Context Engineering", chinese:"上下文工程", brief:"设计和管理AI代理上下文窗口内容的学科", definition:"上下文工程是设计AI代理在每一步所看到的内容的学科，包括系统提示、工具描述、对话历史和检索知识的管理。它在训练和推理阶段都至关重要，决定了模型的行为质量。", source:"https://huggingface.co/blog/agent-glossary", related:["Context Window","Prompt Engineering","AI Agent"] },
  { initial:"H", english:"Harness", chinese:"代理框架", brief:"驱动AI代理运行的执行层", definition:"Harness是AI代理内部的执行层，负责调用模型、处理工具调用、决定何时停止。它使代理得以运行，区别于Scaffolding（模型的指令和格式）。Agent = Model + Harness是社区的共识公式。", source:"https://huggingface.co/blog/agent-glossary", related:["AI Agent","Scaffolding","Tool Use"] },
  { initial:"P", english:"Policy", chinese:"策略", brief:"定义代理在任何情况下采取行动概率的行为规则", definition:"策略定义了代理的行为：给定任何情况，它定义采取每个可能行动的概率。在LLM系统中，策略部分由模型权重学习，但行为还取决于周围的脚手架和框架。", source:"https://huggingface.co/blog/agent-glossary", related:["Reinforcement Learning","AI Agent","Weights"] },
  { initial:"R", english:"Reward", chinese:"奖励信号", brief:"告诉训练算法模型是否在改进的评分", definition:"奖励是RL训练中告诉算法模型是否在改进的评分信号。它可以是可验证的（测试通过/失败）或学习到的（人类偏好、LLM作为评判者），可以是稀疏的或稠密的。", source:"https://huggingface.co/blog/agent-glossary", related:["Reinforcement Learning","RLHF","Training Data"] },
  { initial:"R", english:"Rollout", chinese:"轨迹展开", brief:"代理从开始到结束的一次完整运行记录", definition:"Rollout是代理从开始到结束的一次完整运行：包括代理看到了什么、做了什么、每一步获得了什么奖励。也称为trajectory或trace，是强化学习算法学习的原始数据。", source:"https://huggingface.co/blog/agent-glossary", related:["Reinforcement Learning","Reward","AI Agent"] },
  { initial:"S", english:"Scaffolding", chinese:"脚手架", brief:"围绕模型的行为定义层", definition:"Scaffolding是围绕模型的行为定义层：系统提示、工具描述、模型响应的解析方式、跨步骤的记忆管理。它塑造了模型看待世界和行动的方式，在训练和推理时都适用。", source:"https://huggingface.co/blog/agent-glossary", related:["Harness","AI Agent","Context Engineering"] },
  { initial:"S", english:"Sub-agents", chinese:"子代理", brief:"被其他代理调用来处理子任务的代理", definition:"子代理是被另一个代理调用来处理特定子任务的代理，拥有自己的模型和脚手架，独立推理并返回结果。它与工具（函数调用）和技能（打包的知识）的区别在于子代理本身可以推理和使用工具。", source:"https://huggingface.co/blog/agent-glossary", related:["AI Agent","Scaffolding","Tool Use"] },
  { initial:"T", english:"Tool Use", chinese:"工具使用", brief:"代理调用外部API和服务的能力", definition:"工具使用是AI代理调用外部系统（API、代码解释器、数据库、网络搜索、文件系统）的方式。模型以结构化格式表达使用工具的意图，Harness接收调用并路由到正确的函数。", source:"https://huggingface.co/blog/agent-glossary", related:["AI Agent","MCP","Harness"] },
  { initial:"T", english:"Task", chinese:"任务", brief:"要求AI完成的具体工作单元", definition:"任务是分��给AI系统的具体工作目标或指令单元。在AI Agent系统中，复杂任务会被分解为多个子任务，由代理逐步推理和执行。任务的定义清晰度直接影响AI输出质量。", source:"https://huggingface.co/blog/agent-glossary", related:["AI Agent","AI Workflow","Sub-agents"] },
  { initial:"S", english:"System Prompt", chinese:"系统提示词", brief:"定义AI行为角色和约束的预设指令", definition: "系统提示词是在对话开始前提供给大语言模型的预设指令，用于定义AI的角色、能力边界、输出格式和行为约束。它是提示工程（Prompt Engineering）的核心组成部分，决定了模型在整个会话中的行为基调。", source: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary-42-ai-terms-that-everyone-should-know/", related:["Context Engineering","Prompt Engineering","Scaffolding"] }
];

// 权威来源数据
const AUTHORITATIVE_SOURCES = [
  { name: "Britannica", desc: "大英百科全书 - AI相关词条", url: "https://www.britannica.com/" },
  { name: "Boston University", desc: "波士顿大学 - AI术语解释", url: "https://www.bu.edu/" },
  { name: "Stanford HAI", desc: "斯坦福以人为本AI研究所定义", url: "https://hai.stanford.edu/ai-definitions" },
  { name: "Coursera", desc: "AI术语表：你需要知道的AI词汇", url: "https://www.coursera.org/resources/ai-terms" },
  { name: "Google ML Glossary", desc: "Google机器学习术语表", url: "https://developers.google.com/machine-learning/glossary" },
  { name: "CNET", desc: "ChatGPT词汇表：每个人应知的AI术语", url: "https://www.cnet.com/tech/services-and-software/chatgpt-glossary-42-ai-terms-that-everyone-should-know/" },
  { name: "Hugging Face", desc: "AI Agent术语表", url: "https://huggingface.co/blog/agent-glossary" },
  { name: "Wikipedia", desc: "维基百科AI术语表", url: "https://en.wikipedia.org/wiki/Glossary_of_artificial_intelligence" }
];

// 获取所有首字母（去重排序）
function getInitials() {
  const initials = [...new Set(GLOSSARY_DATA.map(t => t.initial))];
  return initials.sort();
}