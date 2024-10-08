"use client";
import { useEffect, useState } from "react";
import { useSandpack, SandpackCodeEditor, SandpackFileExplorer, SandpackLayout, SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import { githubLight, sandpackDark } from "@codesandbox/sandpack-themes";
import apptoapp from './apptoapp'

export const SandpackExamples = () => {
  let [fileState, setFileState] = useState({
    "/App.js": `export default function App() {
      return <h1>Hello Sandpack</h1>;
    }`
  });

  const SimpleCodeViewer = () => {
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [apiKey, setApiKey] = useState("");

    useEffect(() => {
      const storedApiKey = localStorage.getItem('OPENAI_API_KEY');
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }
    }, []);

    const { sandpack } = useSandpack();
    const { files, activeFile } = sandpack;
    const toggleInput = () => {
      setInputVisible(!inputVisible);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      // Handle the input value submission here
      console.log(inputValue);
      const out = await apptoapp(inputValue, files);
      console.log('setting state to', out)
      setFileState(out)
      setInputValue("");
      setInputVisible(false);
    };

    const handleApiKeyChange = (e) => {
      const newApiKey = e.target.value;
      setApiKey(newApiKey);
      localStorage.setItem('OPENAI_API_KEY', newApiKey);
    };

    return (
      <>
        <button 
          onClick={toggleInput} 
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          +
        </button>
        {inputVisible && (
          <form 
            onSubmit={handleSubmit} 
            style={{
              position: 'fixed',
              bottom: '80px',
              right: '20px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            <input 
              type="text" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder="Type your prompt..." 
              style={{
                border: 'none',
                outline: 'none',
                flex: 1,
                padding: '5px',
                borderRadius: '5px',
                marginRight: '5px'
              }} 
            />
            <input 
              type="password" 
              value={apiKey} 
              onChange={handleApiKeyChange} 
              placeholder="OPENAI_API_KEY" 
              style={{
                border: 'none',
                outline: 'none',
                flex: 1,
                padding: '5px',
                borderRadius: '5px',
                marginRight: '5px'
              }} 
            />
            <button 
              type="submit" 
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '5px 10px',
                cursor: 'pointer'
              }}
            >
              Submit
            </button>
          </form>
        )}
      </>
    );
  };

  return (
    <SandpackProvider
      files={fileState}
      theme="light"
      template="react"
    >
      <SandpackLayout>
        <SimpleCodeViewer />
        <SandpackFileExplorer />
        <SandpackCodeEditor closableTabs showTabs />
        <SandpackPreview />
      </SandpackLayout>
    </SandpackProvider>
  );
};
