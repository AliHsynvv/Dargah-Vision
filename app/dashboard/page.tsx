'use client'

import { motion } from 'framer-motion'
import { Plus, Search, MoreVertical, Calendar, Box, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import Header from '@/components/Header'

interface Project {
  id: string
  name: string
  date: string
  status: 'completed' | 'in-progress' | 'draft'
  thumbnail: string
  category: string
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Modern Living Room',
    date: '2024-11-25',
    status: 'completed',
    thumbnail: '2D',
    category: 'Residential'
  },
  {
    id: '2',
    name: 'Office Space Design',
    date: '2024-11-24',
    status: 'in-progress',
    thumbnail: '3D',
    category: 'Commercial'
  },
  {
    id: '3',
    name: 'Bedroom Interior',
    date: '2024-11-23',
    status: 'completed',
    thumbnail: '2D',
    category: 'Residential'
  },
  {
    id: '4',
    name: 'Kitchen Remodel',
    date: '2024-11-22',
    status: 'draft',
    thumbnail: '3D',
    category: 'Residential'
  },
  {
    id: '5',
    name: 'Cafe Interior',
    date: '2024-11-21',
    status: 'completed',
    thumbnail: '2D',
    category: 'Commercial'
  },
  {
    id: '6',
    name: 'Minimalist Apartment',
    date: '2024-11-20',
    status: 'in-progress',
    thumbnail: '3D',
    category: 'Residential'
  },
]

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress' | 'draft'>('all')

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' || project.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="pt-28 px-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold mb-3">Your Projects</h1>
              <p className="text-white/60 text-lg">
                Manage and view all your floor plan conversions
              </p>
            </div>
            <Link
              href="/#apps"
              className="group px-6 py-3 bg-white text-black font-medium flex items-center gap-2 hover:bg-white/90 transition-all duration-300 hover:shadow-xl hover:shadow-white/20 rounded-full"
            >
              <Plus className="w-5 h-5" />
              New Project
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-12">
            <StatCard label="Total Projects" value="6" />
            <StatCard label="Completed" value="3" />
            <StatCard label="In Progress" value="2" />
            <StatCard label="Credits Used" value="24" />
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-12 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors rounded-full"
              />
            </div>
            <div className="flex gap-2">
              <FilterButton
                active={filter === 'all'}
                onClick={() => setFilter('all')}
                label="All"
              />
              <FilterButton
                active={filter === 'completed'}
                onClick={() => setFilter('completed')}
                label="Completed"
              />
              <FilterButton
                active={filter === 'in-progress'}
                onClick={() => setFilter('in-progress')}
                label="In Progress"
              />
              <FilterButton
                active={filter === 'draft'}
                onClick={() => setFilter('draft')}
                label="Draft"
              />
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20"
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} delay={index * 0.05} />
          ))}
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-white/40"
          >
            <Box className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg">No projects found</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-white/10 p-6 hover:border-white/30 transition-colors duration-300 rounded-2xl"
    >
      <div className="text-4xl font-bold mb-2">{value}</div>
      <div className="text-white/60 text-sm">{label}</div>
    </motion.div>
  )
}

function FilterButton({
  active,
  onClick,
  label
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
        active
          ? 'bg-white text-black'
          : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
      }`}
    >
      {label}
    </button>
  )
}

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="group border border-white/10 hover:border-white/30 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-white/5 rounded-2xl"
    >
      {/* Thumbnail */}
      <div className="aspect-[4/3] bg-white/5 flex items-center justify-center relative overflow-hidden cursor-pointer">
        <div className="text-6xl font-bold text-white/10 group-hover:scale-110 transition-transform duration-500">
          {project.thumbnail}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-2 text-sm bg-white text-black px-3 py-1.5 font-medium rounded-full">
            View <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1 group-hover:text-white/80 transition-colors">
              {project.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Calendar className="w-4 h-4" />
              {new Date(project.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
          <button className="p-2 hover:bg-white/5 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40 uppercase tracking-wider">
            {project.category}
          </span>
          <StatusBadge status={project.status} />
        </div>
      </div>
    </motion.div>
  )
}

function StatusBadge({ status }: { status: Project['status'] }) {
  const styles = {
    completed: 'bg-white/10 text-white border-white/20',
    'in-progress': 'bg-white/5 text-white/60 border-white/10',
    draft: 'bg-white/5 text-white/40 border-white/10'
  }

  const labels = {
    completed: 'Completed',
    'in-progress': 'In Progress',
    draft: 'Draft'
  }

  return (
    <span className={`px-2 py-1 text-xs border ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

