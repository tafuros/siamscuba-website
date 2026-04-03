import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

const SUBMIT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-booking`;

const CERT_LEVELS = [
  "Open Water",
  "Advanced Open Water",
  "Rescue Diver",
  "Divemaster",
  "Instructor",
] as const;

const bookingSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  whatsapp: z.string().trim().min(7, "Please enter a valid phone number").max(20),
  certLevel: z.string().min(1, "Please select your certification level"),
  licensePhoto: z
    .instanceof(File, { message: "Please upload your diving license" })
    .refine((f) => f.size <= MAX_FILE_SIZE, "File must be under 5MB")
    .refine((f) => ACCEPTED_IMAGE_TYPES.includes(f.type), "Only JPG, PNG, or WebP"),
  logbookPhoto: z
    .instanceof(File, { message: "Please upload your last dive record" })
    .refine((f) => f.size <= MAX_FILE_SIZE, "File must be under 5MB")
    .refine((f) => ACCEPTED_IMAGE_TYPES.includes(f.type), "Only JPG, PNG, or WebP"),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface FunDiveBookingFormProps {
  date: string;
  slotLabel: string;
  slotTime: string;
  onSuccess: () => void;
}

async function uploadFile(file: File, prefix: string): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("booking-docs").upload(path, file);
  if (error) throw new Error(`Upload failed: ${error.message}`);
  const { data } = supabase.storage.from("booking-docs").getPublicUrl(path);
  return data.publicUrl;
}

function FileUploadField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: File | undefined;
  onChange: (file: File | undefined) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (file: File | undefined) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
    onChange(file);
  };

  const clear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    onChange(undefined);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">{label}</label>
      {preview ? (
        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={clear}
            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-3 w-full rounded-lg border border-dashed border-border hover:border-primary/50 bg-muted/30 text-sm text-muted-foreground transition-colors"
        >
          <Upload className="h-4 w-4" />
          Choose file
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}

const FunDiveBookingForm = ({ date, slotLabel, slotTime, onSuccess }: FunDiveBookingFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      email: "",
      whatsapp: "",
      certLevel: "",
    },
  });

  const dateFormatted = format(new Date(date + "T12:00:00"), "EEEE, MMMM d");

  const onSubmit = async (data: BookingFormValues) => {
    setSubmitting(true);
    try {
      // Upload files in parallel
      const [licenseUrl, logbookUrl] = await Promise.all([
        uploadFile(data.licensePhoto, "license"),
        uploadFile(data.logbookPhoto, "logbook"),
      ]);

      // Build notes string with all metadata
      const notes = [
        `Cert: ${data.certLevel}`,
        `Dive type: ${slotLabel} (${slotTime})`,
        `WhatsApp: ${data.whatsapp}`,
        `License: ${licenseUrl}`,
        `Logbook: ${logbookUrl}`,
      ].join(" | ");

      // POST to DiveFlow API
      const res = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: data.whatsapp,
          desiredStartDate: date,
          notes,
          wantsAccommodation: false,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error?.message || `Server error (${res.status})`);
      }

      toast({
        title: "Booking request sent! ✅",
        description: "We'll contact you shortly to confirm your dive.",
      });
      onSuccess();
    } catch (err: any) {
      toast({
        title: "Something went wrong",
        description: err.message || "Please try again or contact us via WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <DialogHeader className="mb-4">
        <DialogTitle className="font-display text-xl">Book Your Fun Dive</DialogTitle>
        <DialogDescription>
          {dateFormatted} — {slotLabel} ({slotTime})
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+66 812 345 678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="certLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certification Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CERT_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="licensePhoto"
            render={({ field, fieldState }) => (
              <FormItem>
                <FileUploadField
                  label="Diving License Photo"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logbookPhoto"
            render={({ field, fieldState }) => (
              <FormItem>
                <FileUploadField
                  label="Last Dive Record (Logbook)"
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-2" size="lg" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending…
              </>
            ) : (
              "Send Booking Request"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FunDiveBookingForm;
