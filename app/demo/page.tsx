'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Download, Upload, Sparkles } from 'lucide-react'

import Button from '@/components/Button'
import Card from '@/components/Card'
import Modal from '@/components/Modal'
import BeforeAfterSlider from '@/components/BeforeAfterSlider'
import UploadZone from '@/components/UploadZone'
import Toggle from '@/components/Toggle'
import Header from '@/components/Header'

export default function DemoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toggleEnabled, setToggleEnabled] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="pt-28 px-8 max-w-7xl mx-auto pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">Component Library</h1>
          <p className="text-white/60 text-lg">
            Ultra-minimal, black & white premium UI components
          </p>
        </motion.div>

        {/* Buttons Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Primary</h3>
              <div className="space-y-3">
                <Button size="sm">Small Button</Button>
                <Button size="md">Medium Button</Button>
                <Button size="lg">Large Button</Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">With Icons</h3>
              <div className="space-y-3">
                <Button icon={ArrowRight}>Next Step</Button>
                <Button icon={Upload} iconPosition="left">Upload File</Button>
                <Button icon={Download}>Download</Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Variants</h3>
              <div className="space-y-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Cards Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <Sparkles className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hover Effect</h3>
              <p className="text-white/60">
                Cards with smooth hover animations and transitions
              </p>
            </Card>

            <Card hover={false} padding="lg">
              <Upload className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Hover</h3>
              <p className="text-white/60">
                Static card without hover effects
              </p>
            </Card>

            <Card padding="sm">
              <Download className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Small Padding</h3>
              <p className="text-white/60">
                Compact card with reduced padding
              </p>
            </Card>
          </div>
        </section>

        {/* Before/After Slider */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Before/After Slider</h2>
          <Card hover={false}>
            <BeforeAfterSlider />
          </Card>
        </section>

        {/* Upload Zone */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Upload Zone</h2>
          <Card hover={false}>
            <UploadZone
              onFileSelect={(file) => {
                setSelectedFile(file)
                console.log('File selected:', file)
              }}
            />
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-white/60 text-sm"
              >
                Selected: {selectedFile.name}
              </motion.div>
            )}
          </Card>
        </section>

        {/* Toggle */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Toggle Switch</h2>
          <Card>
            <div className="space-y-6">
              <Toggle
                enabled={toggleEnabled}
                onChange={setToggleEnabled}
                label="Enable Feature"
              />
              <Toggle
                enabled={false}
                onChange={() => {}}
                label="Disabled Toggle"
                disabled
              />
              <div className="pt-4 border-t border-white/10">
                <p className="text-white/60 text-sm">
                  Current state: {toggleEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Modal */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Modal</h2>
          <Card>
            <Button onClick={() => setIsModalOpen(true)}>
              Open Modal
            </Button>
          </Card>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Example Modal"
            size="md"
          >
            <div className="space-y-4">
              <p className="text-white/80">
                This is a beautiful minimal modal with smooth animations.
              </p>
              <p className="text-white/60">
                It includes backdrop blur, slide-in animation, and responsive sizing.
              </p>
              <div className="flex gap-3 pt-4">
                <Button onClick={() => setIsModalOpen(false)}>
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        </section>

        {/* Color Palette */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card hover={false}>
              <div className="w-full h-24 bg-black border border-white/20 mb-3" />
              <div className="text-sm font-mono">#000000</div>
              <div className="text-xs text-white/60">Pure Black</div>
            </Card>
            <Card hover={false}>
              <div className="w-full h-24 bg-white mb-3" />
              <div className="text-sm font-mono">#FFFFFF</div>
              <div className="text-xs text-white/60">Pure White</div>
            </Card>
            <Card hover={false}>
              <div className="w-full h-24 bg-white/10 border border-white/20 mb-3" />
              <div className="text-sm font-mono">white/10</div>
              <div className="text-xs text-white/60">10% Opacity</div>
            </Card>
            <Card hover={false}>
              <div className="w-full h-24 bg-white/20 border border-white/20 mb-3" />
              <div className="text-sm font-mono">white/20</div>
              <div className="text-xs text-white/60">20% Opacity</div>
            </Card>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Typography</h2>
          <Card hover={false}>
            <div className="space-y-4">
              <div>
                <h1 className="text-6xl font-bold mb-2">Heading 1</h1>
                <code className="text-xs text-white/40">text-6xl font-bold</code>
              </div>
              <div>
                <h2 className="text-5xl font-bold mb-2">Heading 2</h2>
                <code className="text-xs text-white/40">text-5xl font-bold</code>
              </div>
              <div>
                <h3 className="text-3xl font-semibold mb-2">Heading 3</h3>
                <code className="text-xs text-white/40">text-3xl font-semibold</code>
              </div>
              <div>
                <p className="text-xl mb-2">Large body text for descriptions and introductions</p>
                <code className="text-xs text-white/40">text-xl</code>
              </div>
              <div>
                <p className="text-base mb-2">Regular body text for main content</p>
                <code className="text-xs text-white/40">text-base</code>
              </div>
              <div>
                <p className="text-sm mb-2">Small text for captions and secondary information</p>
                <code className="text-xs text-white/40">text-sm</code>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}

