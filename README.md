# react-whatsapp-editor

![NPM Version](https://img.shields.io/npm/v/react-whatsapp-editor)
![License](https://img.shields.io/npm/l/react-whatsapp-editor)
![React](https://img.shields.io/badge/React-18.0+-blue)

**🌟 [Try the Live Interactive Demo Here!](https://react-whatsapp-editor-demo.vercel.app) 🌟**

A plug-and-play, enterprise-grade rich text editor for React that perfectly replicates WhatsApp's unique Markdown formatting rules. Built on top of Meta's powerful [Lexical](https://lexical.dev/) framework.

![React WhatsApp Editor Demo](https://raw.githubusercontent.com/emmanuel254/react-whatsapp-editor/main/demo.png)

## 🚀 Why this editor?

Standard Markdown editors break when you try to apply WhatsApp's strict formatting rules (like disabling bolding inside code blocks or preventing multiline inline styles). 

**React WhatsApp Editor** is engineered specifically for chat applications, CRM tools, and messaging clones. It provides a polished UI with built-in toolbar controls, smart markdown parsing, and zero configuration required.

### ✨ Features
* **WhatsApp Markdown Rules:** Supports `*bold*`, `_italic_`, `~strikethrough~`, `` `inline code` ``, and ` ```multiline code``` `.
* **Smart Toolbar:** Context-aware formatting buttons that disable themselves when inside conflicting block elements.
* **Two-Way Binding:** Safely load database strings into the editor without cursor jumping.
* **First-Class Dark Mode:** Built-in `light` and `dark` themes.
* **Lexical Engine:** Powered by the same robust text engine used by Meta.

---

## 📦 Installation

Install the package via your preferred package manager:

```bash
npm install react-whatsapp-editor
# or
yarn add react-whatsapp-editor
# or
pnpm add react-whatsapp-editor

```

⚠️ **Important:** You must import the compiled CSS file in your app for the editor and toolbar to render correctly!

---

## 💻 Quick Start

Here is a minimal example of how to use the editor in your React application:

```tsx
import React, { useState } from 'react';
import { WhatsappEditor } from 'react-whatsapp-editor';

// 1. Import the default styles!
import 'react-whatsapp-editor/style.css'; 

export default function ChatApp() {
  const [message, setMessage] = useState('');

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <WhatsappEditor 
        value={message}
        onChange={(newValue) => setMessage(newValue)}
        theme="light"
        placeholder="Type a message..."
      />
      
      <div style={{ marginTop: '20px' }}>
        <strong>Raw Output:</strong>
        <pre>{message}</pre>
      </div>
    </div>
  );
}

```

---

## 🛠 API Reference (Props)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `""` | The raw Markdown string to populate the editor. |
| `onChange` | `(value: string) => void` | `undefined` | Callback fired on every keystroke. Returns the formatted Markdown string. |
| `theme` | `'light' | 'dark'` | `'light'` | Toggles the built-in UI color variables. |
| `placeholder` | `string` | `""` | Text to display when the editor is empty. |
| `className` | `string` | `""` | Optional CSS class to append to the root wrapper. |

---

## 📝 Supported Formatting

This editor strictly enforces modern WhatsApp syntax:

* **Bold:** Wrap text in asterisks `*like this*`.
* **Italic:** Wrap text in underscores `_like this_`.
* **Strikethrough:** Wrap text in tildes `~like this~`.
* **Inline Code:** Wrap text in single backticks ``like this``.
* **Multiline Code Block:** Type three backticks ````` and start typing to create a shaded code block.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://www.google.com/search?q=https://github.com/emmanuel254/react-whatsapp-editor/issues).

## 📜 License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
