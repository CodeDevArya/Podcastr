import { GeneratePodcastProps } from '@/types'
import React, { useRef, useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid';
import { toast, useToast } from "@/components/ui/use-toast"

import { useUploadFiles } from '@xixixao/uploadstuff/react';
import { cn } from '@/lib/utils'
import { Input } from './ui/input'
import Image from 'next/image'




const GeneratePodcast = (props: GeneratePodcastProps) => {
  const getPodcastAudio = useAction(api.openai.generateAudioAction)
  const [checkVoice, setCheckVoice] = useState(false)


  const useGeneratePodcast = ({
    setAudio, voiceType, voicePrompt, setAudioStorageId
  }: GeneratePodcastProps) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const { toast } = useToast()

    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const { startUpload } = useUploadFiles(generateUploadUrl)


    const getAudioUrl = useMutation(api.podcasts.getUrl);

    const generatePodcast = async (blob: Blob, fileName: string) => {
      setIsGenerating(true)
      setAudio('')

      try {

        const file = new File([blob], fileName, { type: 'audio/mpeg' });

        const uploaded = await startUpload([file]);
        const storageId = (uploaded[0].response as any).storageId;

        setAudioStorageId(storageId);

        const audioUrl = await getAudioUrl({ storageId });
        setAudio(audioUrl!)
        setIsGenerating(false)
        toast({
          title: 'Podcast Uploaded Successfully'
        })

      } catch (error) {
        console.log(error)
        toast({
          title: 'Error uploading Podcasts',
          variant: 'destructive'
        })
      }
    }

    return { isGenerating, generatePodcast }
  }

  const voiceRef = useRef<HTMLInputElement>(null)
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);
  const [isAiVoice, setIsAiVoice] = useState(false)

  const uploadVoice = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {

      const files = e.target.files;

      if (!files) return;

      const file = files[0];
      const returnExtension = ((file.name).split('.'))[1];
      console.log(returnExtension)

      if (returnExtension === 'mp3' || returnExtension === 'm4a' || returnExtension === 'mp4') {

        const blob = await file.arrayBuffer().then((ab) => new Blob([ab]))
        generatePodcast(blob, file.name)

      } else {

        toast({
          title: 'Invalid podcast file type',
          variant: 'destructive'
        })

      }

    } catch (error) {

      console.log(error)
      toast({
        title: 'Error Uploading podcast',
        variant: 'destructive'
      })
    }
  }

  return (
    <div>
      <div className="generate_thumbnail">
        <Button
          type="button"
          variant="plain"
          onClick={() => setIsAiVoice(true)}
          className={cn('', {
            'bg-black-6': isAiVoice
          })}
        >
          Audio Description
        </Button>
        <Button
          type="button"
          variant="plain"
          onClick={() => setIsAiVoice(false)}
          className={cn('', {
            'bg-black-6': !isAiVoice
          })}
        >
          Upload Podcast
        </Button>
      </div>
      {
        isAiVoice ? (
          <div className="flex flex-col gap-5">
            <div className="mt-5 flex flex-col gap-2.5">
              <Label className="text-16 font-bold text-white-1">
                Enter Audio Description
              </Label>
              <Textarea
                className="input-class font-light focus-visible:ring-offset-orange-1"
                placeholder='Provide Audio Description'
                rows={5}
                value={props.voicePrompt}
                onChange={(e) => props.setVoicePrompt(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="image_div" onClick={() => voiceRef?.current?.click()}>
            <Input
              type="file"
              className="hidden"
              ref={voiceRef}
              onChange={(e) => { uploadVoice(e); setCheckVoice(true) }}
            />
            {!isGenerating ? (
              <>
                <Image src="/icons/upload-image.svg" width={40} height={40} alt="upload" />
                <div className="flex flex-col items-center gap-1">
                  <h2 className="text-12 font-bold text-orange-1">
                    Click to upload
                  </h2>
                  <p className="text-12 font-normal text-gray-1">EXAMPLE:&nbsp; mp3, m4a or mp4</p>
                </div>
              </>
            ) : (
              <div className="text-16 flex-center font-medium text-white-1">
                Uploading
                <Loader size={20} className="animate-spin ml-2" />
              </div>
            )}
          </div>
        )

      }
      {checkVoice && (
        <div className="flex-center w-full">
          <audio
            controls
            src={props.audio}
            autoPlay
            className="mt-5"
            onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
          />
        </div>
      )}

    </div>
  )
}

export default GeneratePodcast