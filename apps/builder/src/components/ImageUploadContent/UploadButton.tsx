import { useToast } from '@/hooks/useToast'
import { Button, ButtonProps, chakra } from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react'
import { FilePathUploadProps } from '@/features/upload/api/generateUploadUrl'
import { trpc } from '@/lib/trpc'
import { compressFile } from '@/helpers/compressFile'

type UploadButtonProps = {
  fileType: 'image' | 'audio'
  filePathProps: FilePathUploadProps
  onFileUploaded: (url: string) => void
} & ButtonProps

export const UploadButton = ({
  fileType,
  filePathProps,
  onFileUploaded,
  ...props
}: UploadButtonProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const { showToast } = useToast()
  const [file, setFile] = useState<File>()

  const { mutate } = trpc.generateUploadUrl.useMutation({
    onSettled: () => {
      console.log('entered onsettled hereee')
      setIsUploading(false)
    },
    onSuccess: async (data) => {
      console.log('entereddddddd hereeeeee')
      if (!file) return
      const formData = new FormData()
      Object.entries(data.formData).forEach(([key, value]) => {
        formData.append(key, value)
      })
      formData.append('file', file)
      const upload = await fetch(data.presignedUrl, {
        method: 'POST',
        // method: 'PUT',
        // headers: {
        //   'x-ms-blob-type': 'BlockBlob',
        //   'Content-Type': fileType,
        // },
        body: formData,
      })

      if (!upload.ok) {
        showToast({ description: 'Error while trying to upload the file.' })
        return
      }

      onFileUploaded(data.fileUrl + '?v=' + Date.now())
    },
  })

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log('handle input change called')
    if (!e.target?.files) return
    setIsUploading(true)
    const file = e.target.files[0] as File | undefined
    if (!file)
      return showToast({ description: 'Could not read file.', status: 'error' })
    setFile(await compressFile(file))
    console.log('handle input change callledd')
    mutate({
      filePathProps,
      fileType: file.type,
    })
  }

  return (
    <>
      <chakra.input
        data-testid="file-upload-input"
        type="file"
        id="file-input"
        display="none"
        onChange={handleInputChange}
        accept={fileType === 'image' ? '.jpg, .jpeg, .png, .gif' : '.mp3, .wav'}
      />
      <Button
        as="label"
        size="sm"
        htmlFor="file-input"
        cursor="pointer"
        isLoading={isUploading}
        {...props}
      >
        {props.children}
      </Button>
    </>
  )
}
