# ADK TypeScript - So Sánh Với Call API Thông Thường

## Tổng Quan
ADK TypeScript là một framework cấp doanh nghiệp (enterprise-grade) để xây dựng hệ thống AI Agent phức tạp với TypeScript. Thay vì chỉ đơn giản call API LLM, ADK cung cấp một hệ sinh thái hoàn chỉnh để phát triển ứng dụng AI production-ready.

---

## So Sánh: Call API Trực Tiếp vs ADK Framework

### 1. **Quản Lý Multi-LLM Provider**

#### ❌ Call API Thông Thường:
```typescript
// Phải viết code riêng cho từng provider
const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${OPENAI_KEY}` },
  body: JSON.stringify({ model: 'gpt-4', messages: [...] })
});

const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini', {
  // Cấu trúc request khác hoàn toàn
});
```

#### ✅ ADK Framework:
```typescript
// Một interface thống nhất cho tất cả providers
const response = await AgentBuilder
  .withModel("gpt-4")  // hoặc "gemini-2.5-flash", "claude-3"
  .ask("Your question");
```

**Lợi ích:**
- Switch giữa các LLM provider chỉ bằng 1 dòng code
- Không cần học API docs của từng provider
- Hỗ trợ: OpenAI, Google Gemini, Anthropic Claude, AI SDK models

---

### 2. **Session & Memory Management**

#### ❌ Call API Thông Thường:
```typescript
// Phải tự quản lý conversation history
let conversationHistory = [];

conversationHistory.push({ role: 'user', content: 'Hello' });
const response1 = await callLLM(conversationHistory);
conversationHistory.push({ role: 'assistant', content: response1 });

conversationHistory.push({ role: 'user', content: 'What did I just say?' });
const response2 = await callLLM(conversationHistory);
// Phải tự implement lưu trữ, phân trang, cleanup...
```

#### ✅ ADK Framework:
```typescript
// Session tự động được quản lý
const { runner } = await AgentBuilder
  .create("assistant")
  .withModel("gemini-2.5-flash")
  .withSessionService(new InMemorySessionService())
  .withMemory(new VectorMemoryService())  // Long-term memory
  .build();

await runner.ask("Hello");
await runner.ask("What did I just say?");  // Tự động có context
```

**Lợi ích:**
- **Session Management**: Tự động lưu trữ lịch sử hội thoại
- **Memory Service**: Long-term memory qua nhiều conversation
- **State Management**: Quản lý state giữa các lượt hội thoại
- **Multiple Storage Backends**: In-memory, Redis, Database

---

### 3. **Tool Integration (Function Calling)**

#### ❌ Call API Thông Thường:
```typescript
// Phải tự implement tool calling flow
const response = await callLLM({
  functions: [{
    name: 'search_web',
    parameters: { query: 'string' }
  }]
});

// Tự parse response
if (response.function_call) {
  const args = JSON.parse(response.function_call.arguments);
  const toolResult = await executeWebSearch(args.query);
  
  // Gọi lại LLM với kết quả
  const finalResponse = await callLLM({
    messages: [...history, toolResult]
  });
}
```

#### ✅ ADK Framework:
```typescript
// Tool tự động được integrate và execute
const searchTool = createTool({
  name: "search_web",
  description: "Search the web for information",
  schema: z.object({ query: z.string() }),
  fn: async ({ query }) => {
    return await webSearch(query);
  }
});

const { runner } = await AgentBuilder
  .create("research-agent")
  .withModel("gemini-2.5-flash")
  .withTools(searchTool, calculatorTool, fileOpsTool)
  .build();

// Agent tự động quyết định khi nào dùng tool
await runner.ask("Search for AI news and calculate the average sentiment");
```

**Lợi ích:**
- **Automatic Tool Orchestration**: Framework tự động gọi tools khi cần
- **Built-in Tools**: Google Search, HTTP Request, File Operations
- **Custom Tools**: Dễ dàng tạo custom tools với Zod schema validation
- **MCP Support**: Tích hợp Model Context Protocol
- **Retry & Error Handling**: Tự động xử lý lỗi

---

### 4. **Multi-Agent Workflows**

#### ❌ Call API Thông Thường:
```typescript
// Phải tự orchestrate nhiều agents
async function runWorkflow(input) {
  // Step 1: Research agent
  const research = await callLLM({
    messages: [{ role: 'system', content: 'You are a researcher' }]
  });
  
  // Step 2: Analyst agent (phải tự truyền data)
  const analysis = await callLLM({
    messages: [
      { role: 'system', content: 'You are an analyst' },
      { role: 'user', content: `Analyze: ${research}` }
    ]
  });
  
  // Step 3: Summary agent
  const summary = await callLLM({
    messages: [
      { role: 'system', content: 'You are a summarizer' },
      { role: 'user', content: `Summarize: ${analysis}` }
    ]
  });
  
  return summary;
}
```

#### ✅ ADK Framework:
```typescript
// Sequential workflow (tuần tự)
const workflow = await AgentBuilder
  .create("research_pipeline")
  .asSequential([researchAgent, analysisAgent, summaryAgent])
  .withMemory(sharedMemory)  // Shared memory giữa agents
  .build();

const result = await workflow.ask("Analyze market trends");

// Parallel workflow (song song)
const parallelAnalysis = await AgentBuilder
  .create("multi_analysis")
  .asParallel([sentimentAgent, topicAgent, summaryAgent])
  .build();

// Loop workflow (lặp lại cho đến khi đạt điều kiện)
const refinementLoop = await AgentBuilder
  .create("iterative_refiner")
  .asLoop([drafterAgent, reviewerAgent], maxIterations: 5)
  .build();

// LangGraph workflow (graph-based)
const graphWorkflow = await AgentBuilder
  .create("complex_graph")
  .asLangGraph(nodes, rootNode)
  .build();
```

**Lợi ích:**
- **Sequential Agents**: Chạy agents theo thứ tự (pipeline)
- **Parallel Agents**: Chạy đồng thời nhiều agents
- **Loop Agents**: Lặp lại cho đến khi đạt điều kiện
- **LangGraph**: Graph-based workflows phức tạp
- **Agent Transfers**: Chuyển giao công việc giữa agents
- **Shared State**: Chia sẻ state và memory giữa agents

---

### 5. **Streaming Support**

#### ❌ Call API Thông Thường:
```typescript
// Phải tự xử lý streaming response
const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ stream: true, ...data })
});

const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  // Tự parse SSE format
  const lines = chunk.split('\n');
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const json = JSON.parse(line.slice(6));
      console.log(json.choices[0].delta.content);
    }
  }
}
```

#### ✅ ADK Framework:
```typescript
// Streaming được tích hợp sẵn
const { runner } = await AgentBuilder
  .create("streaming-agent")
  .withModel("gemini-2.5-flash")
  .withRunConfig({ streaming: true })
  .build();

for await (const event of runner.stream("Write a story")) {
  if (event.author === 'assistant') {
    process.stdout.write(event.content?.parts[0]?.text || '');
  }
}
```

**Lợi ích:**
- Real-time streaming responses
- Event-based architecture
- Tự động parse và format
- Hỗ trợ tool calls trong streaming

---

### 6. **Code Execution**

#### ❌ Call API Thông Thường:
```typescript
// Không có built-in code execution
// Phải tự implement sandbox environment
// Phải tự xử lý security, isolation, cleanup
```

#### ✅ ADK Framework:
```typescript
const { runner } = await AgentBuilder
  .create("code-agent")
  .withModel("gemini-2.5-flash")
  .withCodeExecutor(new ContainerCodeExecutor())  // Sandboxed execution
  .build();

// Agent có thể tự viết và chạy code
await runner.ask("Calculate the fibonacci sequence up to 100");
```

**Lợi ích:**
- **LocalUnsafeCodeExecutor**: Chạy local (dev only)
- **ContainerCodeExecutor**: Docker isolation
- **VertexAiCodeExecutor**: Cloud-based execution
- Security và isolation tự động

---

### 7. **Artifact Management**

#### ❌ Call API Thông Thường:
```typescript
// Phải tự quản lý files và documents
const generatedCode = await callLLM("Generate a Python script");
fs.writeFileSync('output.py', generatedCode);
// Không có versioning, metadata, hoặc sharing
```

#### ✅ ADK Framework:
```typescript
const { runner } = await AgentBuilder
  .create("generator-agent")
  .withModel("gemini-2.5-flash")
  .withArtifactService(new GcsArtifactService())  // Cloud storage
  .build();

// Agent tự động tạo và quản lý artifacts
await runner.ask("Generate a React component for user profile");

// Artifacts tự động có:
// - Version control
// - Metadata tracking
// - Content type detection
// - Sharing between agents
```

**Lợi ích:**
- Automatic file storage và management
- Version control tích hợp
- Multiple storage backends (In-memory, GCS)
- Sharing giữa agents

---

### 8. **Error Handling & Retry Logic**

#### ❌ Call API Thông Thường:
```typescript
// Phải tự implement retry và error handling
async function callWithRetry(prompt, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await callLLM(prompt);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      if (error.status === 429) {
        await sleep(Math.pow(2, i) * 1000);  // Exponential backoff
      }
    }
  }
}
```

#### ✅ ADK Framework:
```typescript
// Retry logic tích hợp sẵn
const { runner } = await AgentBuilder
  .create("resilient-agent")
  .withModel("gemini-2.5-flash")
  .withRunConfig({
    timeout: 30000,
    maxRetries: 3,
    retryDelay: 1000
  })
  .build();

// Tự động retry khi có lỗi
await runner.ask("Complex query");
```

**Lợi ích:**
- Automatic retry với exponential backoff
- Timeout management
- Graceful error handling
- Rate limiting support

---

### 9. **Callbacks & Monitoring**

#### ❌ Call API Thông Thường:
```typescript
// Phải tự implement logging và monitoring
console.log("Calling LLM...");
const start = Date.now();
const response = await callLLM(prompt);
console.log(`Completed in ${Date.now() - start}ms`);
console.log("Tokens used:", response.usage);
```

#### ✅ ADK Framework:
```typescript
const { runner } = await AgentBuilder
  .create("monitored-agent")
  .withModel("gemini-2.5-flash")
  .withBeforeAgentCallback(async (ctx) => {
    console.log(`🔍 Starting: ${ctx.agentName}`);
    console.log(`Input: ${ctx.input}`);
  })
  .withAfterAgentCallback(async (ctx) => {
    console.log(`✅ Completed: ${ctx.agentName}`);
    console.log(`Output stored in: ${ctx.state.outputKey}`);
  })
  .withBeforeToolCallback(async (ctx, tool) => {
    console.log(`🔧 Calling tool: ${tool.name}`);
  })
  .withAfterToolCallback(async (ctx, tool, result) => {
    console.log(`✅ Tool ${tool.name} completed`);
  })
  .build();
```

**Lợi ích:**
- **BeforeAgent/AfterAgent**: Hook vào lifecycle
- **BeforeTool/AfterTool**: Monitor tool execution
- **BeforeModel/AfterModel**: Track LLM calls
- Tích hợp với logging và monitoring services

---

### 10. **Type Safety & Schema Validation**

#### ❌ Call API Thông Thường:
```typescript
// Không có type safety
const response: any = await callLLM(prompt);
const result = JSON.parse(response);  // Có thể sai format
```

#### ✅ ADK Framework:
```typescript
import { z } from 'zod';

// Input/Output schemas với Zod
const InputSchema = z.object({
  query: z.string(),
  filters: z.array(z.string())
});

const OutputSchema = z.object({
  results: z.array(z.object({
    title: z.string(),
    score: z.number()
  })),
  totalCount: z.number()
});

const { runner } = await AgentBuilder
  .create("typed-agent")
  .withModel("gemini-2.5-flash")
  .withInputSchema(InputSchema)
  .withOutputSchema(OutputSchema)
  .build();

// Type-safe!
const result = await runner.ask({ query: "AI", filters: ["recent"] });
// result.results[0].title  <- TypeScript knows this
```

**Lợi ích:**
- Full TypeScript support
- Zod schema validation
- Automatic type inference
- Runtime validation

---

### 11. **Planning & Reasoning**

#### ❌ Call API Thông Thường:
```typescript
// Không có built-in planning
// Phải tự implement chain-of-thought, step-by-step reasoning
```

#### ✅ ADK Framework:
```typescript
const planner = new ChainOfThoughtPlanner();

const { runner } = await AgentBuilder
  .create("reasoning-agent")
  .withModel("gemini-2.5-flash")
  .withPlanner(planner)  // Automatic planning
  .build();

// Agent sẽ tự động:
// 1. Break down complex tasks
// 2. Plan steps
// 3. Execute systematically
// 4. Self-reflect và adjust
```

**Lợi ích:**
- Built-in planning strategies
- Chain-of-thought reasoning
- Step-by-step execution
- Self-reflection capabilities

---

### 12. **Context Hierarchy**

#### ❌ Call API Thông Thường:
```typescript
// Không có context management
// Tất cả đều có full access (security risk)
```

#### ✅ ADK Framework:
```typescript
// Hierarchical context với fine-grained access control
// ReadonlyContext -> CallbackContext -> ToolContext

// ReadonlyContext: Read-only access
// CallbackContext: Mutable state, artifact management
// ToolContext: Function call tracking, memory search
```

**Lợi ích:**
- Fine-grained access control
- Prevents accidental mutations
- Better security
- Predictable và debuggable

---

## Bảng Tổng Hợp So Sánh

| Tính Năng | Call API Thông Thường | ADK Framework |
|-----------|----------------------|---------------|
| **Multi-LLM Support** | ❌ Phải code riêng từng provider | ✅ Unified interface |
| **Session Management** | ❌ Tự implement | ✅ Tự động, nhiều backends |
| **Memory Service** | ❌ Không có | ✅ Long-term + short-term |
| **Tool Integration** | ❌ Manual orchestration | ✅ Automatic với retry |
| **Multi-Agent** | ❌ Phải tự orchestrate | ✅ Sequential/Parallel/Loop/Graph |
| **Streaming** | ❌ Tự parse SSE | ✅ Built-in, event-based |
| **Code Execution** | ❌ Không có | ✅ Sandboxed, cloud-based |
| **Artifact Management** | ❌ Manual file handling | ✅ Auto với versioning |
| **Error Handling** | ❌ Manual retry | ✅ Auto retry + backoff |
| **Monitoring** | ❌ Manual logging | ✅ Lifecycle callbacks |
| **Type Safety** | ❌ any types | ✅ Full TypeScript + Zod |
| **Planning** | ❌ Không có | ✅ Built-in planners |
| **Context Control** | ❌ Flat access | ✅ Hierarchical |
| **Production Ready** | ❌ Cần nhiều effort | ✅ Sẵn sàng ngay |

---

## Khi Nào Dùng Call API Thông Thường?

### ✅ Phù Hợp Khi:
- Ứng dụng cực kỳ đơn giản (1-2 prompts)
- Prototype nhanh không cần scale
- Tích hợp vào hệ thống đã có sẵn architecture riêng
- Yêu cầu kiểm soát tuyệt đối từng byte request/response

### ❌ Không Phù Hợp Khi:
- Cần multi-agent workflows
- Cần session/memory management
- Cần tool integration
- Cần production-ready features
- Cần scale và maintain

---

## Khi Nào Dùng ADK Framework?

### ✅ Phù Hợp Khi:
- ✅ Xây dựng AI agents phức tạp
- ✅ Cần multi-agent orchestration
- ✅ Cần tool integration (search, APIs, code execution)
- ✅ Cần memory và session management
- ✅ Cần switch giữa nhiều LLM providers
- ✅ Cần streaming real-time
- ✅ Cần production-ready features (retry, monitoring, error handling)
- ✅ Team development với TypeScript
- ✅ Cần scale và maintain lâu dài

---

## Ví Dụ Thực Tế

### Trường Hợp: Research Assistant

#### ❌ Call API Thông Thường (≈200 dòng code):
```typescript
// - Tự manage conversation history
// - Tự implement web search tool
// - Tự orchestrate research -> analyze -> summarize
// - Tự handle errors và retry
// - Tự implement streaming
// = Nhiều code, dễ bug, khó maintain
```

#### ✅ ADK Framework (≈20 dòng code):
```typescript
const { runner } = await AgentBuilder
  .create("research-assistant")
  .withModel("gemini-2.5-flash")
  .withTools(new GoogleSearchTool())
  .withMemory(new VectorMemoryService())
  .withSessionService(new RedisSessionService())
  .asSequential([researchAgent, analyzeAgent, summaryAgent])
  .withRunConfig({ streaming: true, maxRetries: 3 })
  .build();

for await (const event of runner.stream("Research quantum computing")) {
  console.log(event.content);
}
```

---

## Kết Luận

### ADK Framework = Call API + Production Features

```
ADK Framework = 
  + Multi-LLM Unified Interface
  + Session & Memory Management
  + Tool Integration & Orchestration
  + Multi-Agent Workflows
  + Streaming Support
  + Code Execution
  + Artifact Management
  + Error Handling & Retry
  + Monitoring & Callbacks
  + Type Safety
  + Planning & Reasoning
  + Context Control
  + Production-Ready Features
```

### Tỉ Lệ Code Giảm:
- **Đơn giản**: Giảm ~50% code
- **Trung bình**: Giảm ~70% code
- **Phức tạp (multi-agent)**: Giảm ~80-90% code

### ROI (Return on Investment):
- **Development Time**: Giảm 60-80%
- **Maintenance Cost**: Giảm 70%
- **Bug Rate**: Giảm 50-70%
- **Time to Production**: Giảm 70%

---

## Tài Nguyên

- **Documentation**: https://adk.iqai.com/docs/framework/get-started
- **GitHub**: https://github.com/IQAIcom/adk-ts
- **NPM**: https://www.npmjs.com/package/@iqai/adk
- **Examples**: https://github.com/IQAIcom/adk-ts/tree/main/apps/examples
- **Architecture**: Xem thêm trong repo ARCHITECTURE.md

---

**Tóm lại**: ADK TypeScript không phải chỉ là wrapper cho API calls, mà là một **framework toàn diện** giúp xây dựng AI agents production-ready với ít code hơn, ít bug hơn, và dễ maintain hơn rất nhiều so với việc call API trực tiếp.
