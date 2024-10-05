"use client"

import React, { useState, KeyboardEvent, ChangeEvent } from 'react'
import { X } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface TagInputProps {
  onTagsChange: (tags: string) => void
}

export function TagInput({ onTagsChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const addTag = () => {
    const trimmedInput = inputValue.trim()
    if (trimmedInput && !tags.includes(trimmedInput) && tags.length < 5 && trimmedInput.length < 20) {
      const newTags = [...tags, trimmedInput]
      setTags(newTags)
      setInputValue('')
      onTagsChange(newTags.join(','))
    }
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove)
    setTags(newTags)
    onTagsChange(newTags.join(','))
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <TagsViewer tags={tags} removeTag={removeTag} />
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onBlur={addTag}
        placeholder="Erstelle neue Tags durch Eingabe und drücke Enter oder Komma"
        className="w-full"
      />
    </div>
  )
}

export const TagsViewer = ({ tags, removeTag }: { tags: string[], removeTag: ((tag: string) => void) | null }) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="text-sm py-1 px-2">
            {tag}
            { removeTag &&
              <button
              onClick={() => removeTag(tag)}
              className="ml-1 focus:outline-none"
              aria-label={`Remove ${tag} tag`}
            >
              <X className="h-3 w-3" />
            </button>
            }
          </Badge>
        ))}
      </div>
  )
}