import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { keyPool } from './server/keyPool.ts';
import { dataStore } from './server/dataStore.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // --- CATEGORIES API ---
  app.get('/api/categories', (req, res) => {
    res.json(dataStore.getCategories());
  });

  app.post('/api/categories', (req, res) => {
    try {
      const { name, slug, description, icon, color } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Tên danh mục không được để trống' });
      }
      const newCat = dataStore.addCategory({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        description: description || '',
        icon: icon || 'Folder',
        color: color || 'blue',
      });
      res.json({ category: newCat });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/categories/:id', (req, res) => {
    const updated = dataStore.updateCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Không tìm thấy danh mục' });
    }
    res.json({ category: updated });
  });

  app.delete('/api/categories/:id', (req, res) => {
    const success = dataStore.deleteCategory(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Không tìm thấy danh mục' });
    }
    res.json({ success: true });
  });

  // --- ARTICLES API ---
  app.get('/api/articles', (req, res) => {
    const { categoryId, search, status } = req.query as {
      categoryId?: string;
      search?: string;
      status?: any;
    };
    const articles = dataStore.getArticles({ categoryId, search, status });
    res.json(articles);
  });

  app.get('/api/articles/:id', (req, res) => {
    const article = dataStore.getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Không tìm thấy bài viết' });
    }
    dataStore.incrementArticleViews(req.params.id);
    res.json({ article });
  });

  app.post('/api/articles', (req, res) => {
    try {
      const { title, categoryId, summary, content, tags, difficulty, status, relatedErrorCodes, commands } = req.body;
      if (!title || !categoryId || !content) {
        return res.status(400).json({ error: 'Tiêu đề, danh mục và nội dung là bắt buộc' });
      }
      const newArt = dataStore.addArticle({
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        categoryId,
        summary: summary || '',
        content,
        tags: Array.isArray(tags) ? tags : [],
        difficulty: difficulty || 'Cơ bản',
        status: status || 'published',
        author: req.body.author || 'Chuyên viên Bản quyền LicenseTech',
        relatedErrorCodes: Array.isArray(relatedErrorCodes) ? relatedErrorCodes : [],
        commands: Array.isArray(commands) ? commands : [],
      });
      res.json({ article: newArt });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/articles/:id', (req, res) => {
    const updated = dataStore.updateArticle(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Không tìm thấy bài viết' });
    }
    res.json({ article: updated });
  });

  app.delete('/api/articles/:id', (req, res) => {
    const success = dataStore.deleteArticle(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Không tìm thấy bài viết' });
    }
    res.json({ success: true });
  });

  // --- GEMINI KEY POOL MANAGEMENT API ---
  app.get('/api/keys', (req, res) => {
    res.json({
      keys: keyPool.getMaskedKeys(),
      failoverHistory: keyPool.getFailoverHistory(),
    });
  });

  app.post('/api/keys/add', (req, res) => {
    try {
      const { key, label } = req.body;
      if (!key) {
        return res.status(400).json({ error: 'Vui lòng cung cấp khóa API' });
      }
      const record = keyPool.addBackupKey(key, label);
      res.json({ key: record });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/keys/test', async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'ID khóa không hợp lệ' });
      }
      const result = await keyPool.testKey(id);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  app.post('/api/keys/reset', (req, res) => {
    const { id } = req.body;
    const ok = keyPool.resetKeyStatus(id);
    res.json({ success: ok });
  });

  // --- GEMINI CHATBOT WITH MULTI-KEY FAILOVER ---
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Tin nhắn không được để trống' });
      }

      const systemInstruction = `Bạn là Trợ lý AI Chuyên gia Kỹ thuật Bản quyền Phần mềm của hệ thống LicenseTech (phong cách chuyên nghiệp, tận tâm như Hachihi/HangChinhHieu).
Nhiệm vụ của bạn:
1. Hướng dẫn kỹ thuật chuyên sâu về kích hoạt, khắc phục lỗi bản quyền phần mềm (Windows 10/11, Office, Microsoft 365, Windows Server, SQL Server, Adobe Creative Cloud, AutoCAD, Revit, JetBrains, VMware).
2. Phân tích chính xác các mã lỗi kích hoạt (Activation Errors) như 0xC004C008, 0x803FA067, 0xC004C020, 0xC004F074, 0x80070005, 0xC004E015. Cung cấp câu lệnh Command Prompt / PowerShell chi tiết (slmgr.vbs, ospp.vbs, slui 4) kèm giải thích.
3. Tư vấn đúng tiêu chuẩn giấy phép: Phân biệt OEM, Retail (FPP), Volume Licensing (KMS/MAK), CSP, Named User, Core Licensing và Client Access License (User CAL / Device CAL).
4. Cảnh báo các rủi ro pháp lý và kỹ thuật khi sử dụng phần mềm bẻ khóa (crack, KMS lậu, malware, rủi ro kiểm toán BSA/Thanh tra bản quyền theo Luật Sở hữu Trí tuệ Việt Nam).
5. Trả lời bằng tiếng Việt chuyên nghiệp, định dạng Markdown rõ ràng, dễ đọc với code block, bảng biểu so sánh và các bước 1-2-3 thực tế.`;

      // Transform history if provided
      const formattedHistory: { role: string; parts: { text: string }[] }[] = [];
      if (Array.isArray(history)) {
        for (const h of history.slice(-6)) {
          if (h.role && h.text) {
            formattedHistory.push({
              role: h.role === 'user' ? 'user' : 'model',
              parts: [{ text: h.text }],
            });
          }
        }
      }

      const result = await keyPool.generateWithFailover({
        systemInstruction,
        prompt: message,
        history: formattedHistory,
      });

      // Quick contextual suggestions
      const suggestions: string[] = [];
      const lower = message.toLowerCase();
      if (lower.includes('0xc004c008') || lower.includes('lỗi')) {
        suggestions.push('Cách kích hoạt qua tổng đài slui 4', 'Kiểm tra key bằng slmgr.vbs /dli', 'Phân biệt Retail và OEM');
      } else if (lower.includes('office') || lower.includes('365')) {
        suggestions.push('Lệnh xóa key OSPP thừa', 'Xử lý lỗi Unlicensed Product', 'So sánh M365 Business Standard và Apps');
      } else if (lower.includes('server') || lower.includes('cal')) {
        suggestions.push('Cách tính Core License cho 32 Cores', 'Khi nào chọn Device CAL thay vì User CAL?', 'Quy định RDS CAL');
      } else {
        suggestions.push('Lỗi 0xC004C008 xử lý thế nào?', 'Phân biệt Windows OEM và Retail', 'Kiểm tra thời hạn bản quyền slmgr');
      }

      res.json({
        reply: result.text,
        keyUsed: result.keyUsed,
        keyId: result.keyId,
        failoverOccurred: result.failoverOccurred,
        attempts: result.attempts,
        latencyMs: result.latencyMs,
        suggestions,
      });
    } catch (err: any) {
      console.error('Chat error:', err);
      res.status(500).json({
        error: err.message || 'Lỗi xử lý tin nhắn từ Gemini API',
      });
    }
  });

  // --- CONTACT INQUIRIES API ---
  app.post('/api/contact', (req, res) => {
    try {
      const { fullName, email, phone, company, softwareType, inquiryType, message } = req.body;
      if (!fullName || !email || !phone || !message) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ họ tên, email, số điện thoại và nội dung' });
      }
      const newInquiry = dataStore.addContactInquiry({
        fullName,
        email,
        phone,
        company: company || '',
        softwareType: softwareType || 'Chung',
        inquiryType: inquiryType || 'general',
        message,
      });
      res.json({ success: true, inquiry: newInquiry });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/contact', (req, res) => {
    res.json(dataStore.getContactInquiries());
  });

  app.get('/api/inquiries', (req, res) => {
    res.json(dataStore.getContactInquiries());
  });

  // --- VITE MIDDLEWARE / STATIC ASSETS ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
