import { useState, useCallback } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { api } from '../utils/api'
import toast from 'react-hot-toast'
import { GripVertical, Plus, Code2, HelpCircle, Clock, Zap, TrendingUp, Trash2 } from 'lucide-react'

const CreateTest = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: {
      title: '',
      description: '',
      duration: 60,
      difficulty: 'medium',
      questions: [{ 
        id: '1',
        type: 'mcq', 
        question: '', 
        options: ['', '', '', ''], 
        correctAnswer: '0',
        points: 10 
      }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions'
  })

  const questions = watch('questions') || []
  const questionType = watch('questions.0.type')

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return

    const reorderedItems = Array.from(questions)
    const [reorderedItem] = reorderedItems.splice(result.source.index, 1)
    reorderedItems.splice(result.destination.index, 0, reorderedItem)

    const newFields = reorderedItems.map((item, index) => ({
      ...item,
      id: (index + 1).toString()
    }))

    setValue('questions', newFields)
  }, [questions, setValue])

  const addQuestion = () => {
    const newId = (fields.length + 1).toString()
    const newQuestion = questionType === 'coding' 
      ? { id: newId, type: 'coding', question: '', correctAnswer: '// expected solution', points: 20 }
      : { id: newId, type: 'mcq', question: '', options: ['', '', '', ''], correctAnswer: '0', points: 10 }
    
    append(newQuestion)
  }

  const onSubmit = async (data) => {
    try {
      await api.post('/tests', data)
      toast.success('Test created successfully! 🎉')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create test')
    }
  }

  const totalPoints = questions.reduce((sum, q) => sum + (parseInt(q.points) || 0), 0)

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="mb-12 inline-flex items-center px-6 py-3 border-2 border-border shadow-lg font-semibold rounded-3xl text-text-primary hover:shadow-xl hover:-translate-y-0.5 transition-all bg-bg-card backdrop-blur-sm group"
        >
          <svg className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </button>
        
        {/* Header */}
        <div className="glass p-10 lg:p-14 rounded-4xl mb-16 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl text-white shadow-2xl mb-8 mx-auto">
              <TrendingUp className="w-8 h-8 mr-3" />
              <h1 className="text-4xl lg:text-5xl font-black">Create Assessment</h1>
            </div>
            <p className="text-xl lg:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Build technical assessments with AI-powered grading, secure sandbox execution, and drag & drop question builder
            </p>
            <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-emerald/10 rounded-3xl backdrop-blur-sm border border-primary/20">
              <p className="text-lg font-semibold text-text-primary flex items-center justify-center space-x-2">
                <Zap className="w-6 h-6" />
                <span>Total Points: <span className="text-3xl text-primary font-black">{totalPoints}</span></span>
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            {/* Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
              <div>
                <label className="block text-xl font-bold text-text-primary mb-4">Test Title *</label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  className="w-full px-6 py-5 border-2 border-border rounded-4xl focus:ring-4 ring-primary/20 focus:border-primary text-xl font-semibold shadow-2xl h-20"
                  placeholder="Frontend Developer Assessment"
                />
              </div>

              <div>
                <label className="block text-xl font-bold text-text-primary mb-4">Duration (minutes)</label>
                <div className="relative">
                  <input
                    type="number"
                    {...register('duration', { 
                      min: { value: 15, message: 'Minimum 15 minutes' }, 
                      max: { value: 240, message: 'Maximum 4 hours' }
                    })}
                    className="w-full pl-14 pr-6 py-5 border-2 border-border rounded-4xl focus:ring-4 ring-primary/20 focus:border-primary text-xl font-semibold shadow-2xl h-20"
                  />
                  <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-7 h-7 text-primary-500 opacity-60" />
                </div>
              </div>

              <div>
                <label className="block text-xl font-bold text-text-primary mb-4">Difficulty</label>
                <select 
                  {...register('difficulty')} 
                  className="w-full px-6 py-5 border-2 border-border rounded-4xl focus:ring-4 ring-primary/20 focus:border-primary text-xl font-semibold shadow-2xl h-20 appearance-none"
                >
                  <option value="easy">🟢 Beginner</option>
                  <option value="medium">🟡 Intermediate</option>
                  <option value="hard">🔴 Advanced</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xl font-bold text-text-primary mb-6">Test Description (Optional)</label>
              <textarea
                {...register('description')}
                rows={5}
                className="w-full px-6 py-6 border-2 border-border rounded-4xl focus:ring-4 ring-primary/20 focus:border-primary text-lg font-medium shadow-2xl resize-vertical min-h-[140px]"
                placeholder="Describe the role, skills tested, and what successful candidates will demonstrate..."
              />
            </div>

            {/* Questions Section */}
            <div>
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-black text-text-primary flex items-center space-x-4 mb-3">
                    <Code2 className="w-12 h-12 text-emerald-600 shadow-2xl" />
                    <span>Question Builder</span>
                  </h2>
                  <p className="text-xl text-text-secondary">Drag & drop to reorder • AI-powered grading • Secure sandbox execution</p>
                </div>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center space-x-4 px-10 py-6 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-black rounded-4xl shadow-2xl hover:shadow-4xl hover:-translate-y-2 transition-all duration-300 text-xl tracking-wide"
                >
                  <Plus className="w-8 h-8" />
                  <span>Add Question</span>
                </button>
              </div>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="questions">
                  {(provided, snapshot) => (
                    <div 
                      className={`transition-all duration-300 rounded-4xl p-8 lg:p-12 ${
                        snapshot.isDraggingOver 
                          ? 'ring-4 ring-emerald-400/30 shadow-2xl scale-[1.02]' 
                          : 'ring-1 ring-border shadow-xl'
                      }`}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {fields.map((field, index) => (
                        <Draggable key={field.id} draggableId={field.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`
                                mb-8 last:mb-0 p-8 lg:p-10 rounded-4xl shadow-2xl border-4 border-dashed transition-all duration-300 group
                                hover:shadow-3xl hover:border-primary/50 hover:scale-[1.01] cursor-grab
                                ${snapshot.isDragging ? 'shadow-4xl scale-105 opacity-90 rotate-2 ring-4 ring-primary/50' : ''}
                                bg-gradient-to-br ${
                                  snapshot.isDragging 
                                    ? 'from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50' 
                                    : 'from-slate-50/70 to-slate-100/70 dark:from-slate-900/50 dark:to-slate-800/30'
                                }
                              `}
                            >
                              
                              {/* Drag Handle */}
                              <div 
                                className="absolute top-6 right-6 p-3 bg-gradient-to-br from-slate-400 to-slate-500 text-white rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-110 transition-all z-20 opacity-0 group-hover:opacity-100 lg:opacity-100 lg:group-hover:opacity-100"
                                {...provided.dragHandleProps}
                              >
                                <GripVertical className="w-6 h-6" />
                              </div>

                              {/* Header */}
                              <div className="flex items-start justify-between mb-10 pb-8 border-b-2 border-border/50">
                                <div className="flex items-center space-x-6">
                                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-4xl font-black text-2xl flex items-center justify-center shadow-2xl ring-4 ring-white/20">
                                    Q{index + 1}
                                  </div>
                                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-primary/10 to-emerald/10 backdrop-blur-sm rounded-3xl border ring-1 ring-primary/20">
                                    <select
                                      {...register(`questions.${index}.type`, { required: true })}
                                      className="bg-transparent border-none font-bold text-xl px-4 py-2 cursor-pointer focus:outline-none focus:ring-0 h-auto rounded-2xl"
                                    >
                                      <option value="mcq">Multiple Choice</option>
                                      <option value="coding">Live Coding</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* Content */}
                              <div className="space-y-8">
                                {/* Question Text */}
                                <div>
                                  <label className="block text-xl font-bold text-text-primary mb-6 flex items-center space-x-3">
                                    <TrendingUp className="w-8 h-8 text-emerald-600" />
                                    <span>Question Text *</span>
                                  </label>
                                  <textarea
                                    {...register(`questions.${index}.question`, { required: true })}
                                    rows={4}
                                    className="w-full px-8 py-6 border-2 border-border rounded-4xl focus:ring-4 ring-emerald/30 focus:border-emerald shadow-2xl text-xl font-semibold min-h-[140px] resize-vertical"
                                    placeholder="Describe the problem clearly. Include examples for MCQ or coding requirements..."
                                  />
                                </div>

                                {/* Type-specific content */}
                                {watch(`questions.${index}.type`) === 'mcq' ? (
                                  /* MCQ Options - SHORTENED FOR SPACE */
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {[0, 1, 2, 3].map((optIndex) => (
                                      <div key={optIndex} className="space-y-3">
                                        <label className="flex items-center space-x-4 text-lg font-bold text-text-primary cursor-pointer group">
                                          <input
                                            type="radio"
                                            value={optIndex.toString()}
                                            {...register(`questions.${index}.correctAnswer`)}
                                            className="w-6 h-6 text-emerald-600 bg-bg-card border-4 border-border focus:ring-emerald-500 rounded-full shadow-xl cursor-pointer accent-emerald-600 transform group-hover:scale-110 transition-all"
                                          />
                                          <span className="tracking-wide">Option {String.fromCharCode(65 + optIndex)}</span>
                                        </label>
                                        <input
                                          {...register(`questions.${index}.options.${optIndex}`, { required: true })}
                                          className="w-full px-8 py-6 border-2 border-border rounded-4xl focus:ring-4 ring-emerald/30 focus:border-emerald shadow-xl text-lg placeholder:text-text-secondary font-medium"
                                          placeholder={`Type option ${String.fromCharCode(65 + optIndex)} here...`}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div>
                                    <label className="block text-xl font-bold text-text-primary mb-6 flex items-center space-x-3">
                                      <Code2 className="w-8 h-8 text-gradient-emerald" />
                                      <span>Expected Output Code * (AI Grader Reference)</span>
                                    </label>
                                    <textarea
                                      {...register(`questions.${index}.correctAnswer`, { required: true })}
                                      rows={10}
                                      className="w-full px-8 py-6 border-2 border-emerald-200 rounded-4xl focus:ring-4 ring-emerald/40 focus:border-emerald shadow-2xl text-lg font-mono bg-gradient-to-b from-emerald-50/80 to-emerald-100/60 font-semibold min-h-[240px]"
                                      placeholder="// Complete working solution for AI comparison&#10;// function fibonacci(n) {&#10;//   if (n <= 1) return n;&#10;//   return fibonacci(n-1) + fibonacci(n-2);&#10;// }&#10;// console.log(fibonacci(10)); // 55"
                                    />
                                    <div className="mt-4 p-5 bg-emerald-50/80 dark:bg-emerald-950/50 rounded-3xl border border-emerald-200 backdrop-blur-sm">
                                      <p className="text-sm font-semibold text-emerald-800 flex items-center space-x-2 mb-2">
                                        <HelpCircle className="w-5 h-5" />
                                        <span>AI will grade based on output matching this solution</span>
                                      </p>
                                      <p className="text-xs text-emerald-700/80">Tests run in secure Docker sandbox • Multiple test cases supported</p>
                                    </div>
                                  </div>
                                )}

                                {/* Points & Actions */}
                                <div className="flex items-center gap-8 pt-8 border-t border-border/50">
                                  <div className="flex-1">
                                    <label className="block text-lg font-bold text-text-primary mb-3">Points</label>
                                    <div className="flex items-center space-x-4">
                                      <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        {...register(`questions.${index}.points`, { valueAsNumber: true })}
                                        className="flex-1 h-3 bg-bg-secondary rounded-lg appearance-none cursor-pointer accent-primary-600 shadow-inner hover:accent-primary-500 transition-all"
                                      />
                                      <input
                                        type="number"
                                        {...register(`questions.${index}.points`, { 
                                          min: 1, 
                                          max: 100,
                                          valueAsNumber: true 
                                        })}
                                        className="w-24 px-4 py-3 border-2 border-border rounded-2xl focus:ring-4 ring-primary/20 focus:border-primary font-bold text-xl text-right shadow-xl"
                                      />
                                    </div>
                                  </div>
                                  
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 group"
                                  >
                                    <Trash2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    <span className="tracking-wide">Remove</span>
                                  </button>
                                </div>
                              </div>
                              
                              {provided.placeholder}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      
                      {fields.length === 0 && (
                        <div className="col-span-full text-center py-32 opacity-40">
                          <Code2 className="w-32 h-32 mx-auto mb-8" />
                          <h3 className="text-3xl font-black text-text-primary mb-4">No questions yet</h3>
                          <p className="text-xl text-text-secondary mb-8 max-w-md mx-auto">
                            Drag and drop coding challenges and MCQs to build your perfect assessment
                          </p>
                        </div>
                      )}
                      
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            {/* Submit Section */}
            <div className="pt-16 border-t-4 border-dashed border-gradient-primary backdrop-blur-sm">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-left lg:text-center order-2 lg:order-1">
                  <span className="block text-3xl font-black text-primary tracking-wide mb-2">
                    Total Score: <span className="text-5xl">{totalPoints}</span> points
                  </span>
                  <span className="text-xl text-text-secondary block">
                    {fields.length} question{fields.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <button
                  type="submit"
                  disabled={fields.length === 0 || totalPoints === 0}
                  className="order-1 lg:order-2 group relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-500 to-cyan-600 hover:from-emerald-700 hover:via-emerald-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-3xl hover:shadow-4xl py-10 px-20 rounded-4xl text-3xl font-black text-white tracking-wide transition-all duration-500 flex items-center space-x-6 mx-auto lg:ml-auto"
                >
                  <TrendingUp className="w-12 h-12 opacity-90 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-700 flex-shrink-0" />
                  <span>Launch Test & Get Share Link</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateTest

