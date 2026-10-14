"use client";

import React, { useState, useEffect } from 'react';

export default function Home() {
  // 📦 STATE: Ab hamara state database se aane waale data ko store karega
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. 🔄 FETCH FUNCTION: Jaise hi page khulega, yeh database se saare tasks load karega
  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch('/api/tasks');
        const data = await response.json();
        if (Array.isArray(data)) {
          setTasks(data);
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  // 2. 🚀 SUBMIT FUNCTION: Ab yeh temporary data nahi banayega, sidha Database me bhejega
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !budget) return alert("Please fill all fields!");

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, budget })
      });

      if (response.ok) {
        const savedTask = await response.json();
        setTasks([savedTask, ...tasks]); // Naye saved task ko list me upar dikhao
        setTitle(""); // Inputs khali karo
        setBudget("");
      } else {
        alert("Failed to save task to database");
      }
    } catch (error) {
      console.error("Error posting task:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm border-b border-slate-100">
        <div className="text-2xl font-bold text-indigo-600 tracking-tight">WorkSync</div>
        <div className="flex items-center gap-6 font-medium text-slate-600">
          <a href="#form-section" className="hover:text-indigo-600 transition">Post a Task</a>
          <a href="#explore" className="hover:text-indigo-600 transition">Explore</a>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto text-center px-6 py-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4">
          Database Connected <span className="text-indigo-600">WorkSync</span>
        </h1>
      </main>

      {/* Form Section */}
      <section id="form-section" className="max-w-xl mx-auto px-6 mb-16">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Post a New Task</h2>
          
          <form onSubmit={handleAddTask} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Project Title</label>
              <input 
                type="text" 
                placeholder="e.g. Build a Landing Page"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="Web Development">Web Dev</option>
                  <option value="AI & Data Science">AI & Data</option>
                  <option value="Design & Creative">Design</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Budget</label>
                <input 
                  type="text" 
                  placeholder="e.g. 500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">
              Create & Publish Task
            </button>
          </form>
        </div>
      </section>

      {/* Grid Display Section */}
      <section id="explore" className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Active Open Tasks ({tasks.length})</h2>

        {loading ? (
          <p className="text-slate-500">Connecting to database and loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-slate-500">No tasks found in database. Create the first one above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task: any) => (
              <div key={task._id || task.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">{task.category}</span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">⚡ {task.aiScore || "95% Match"}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">{task.title}</h3>

                {/* 🔥 Naya AI Description Block */}
{task.aiDescription && (
  <p className="text-xs text-indigo-600/90 bg-indigo-50/40 p-2.5 rounded-xl border border-indigo-100/50 mb-4 italic">
    🤖 AI Scope: {task.aiDescription}
  </p>
)}  

                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400">Budget</p>
                    <p className="text-lg font-bold text-slate-900">{task.budget}</p>
                  </div>
                  <button className="bg-slate-900 text-white text-sm px-4 py-2 rounded-xl font-medium">Apply</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
