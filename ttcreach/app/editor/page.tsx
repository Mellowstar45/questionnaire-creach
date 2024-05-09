"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MultipleSelector, {
  Option,
} from "../../@/components/ui/multiple-selector";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
const OPTIONS: Option[] = [
  { label: "Email", value: "Email" },
  { label: "Hobby", value: "Hobby" },
  { label: "Number", value: "Number" },
  { label: "Bio", value: "Bio" },
  { label: "Languages", value: "Languages" },
];
import "@/app/styles/form.css";
const optionSchema = z.object({
  value: z.string().optional(),
});

export default function Edit() {
  const router = useRouter();
  const formSchema = z.object({
    questiontitles: z.array(optionSchema).min(1),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();
    const selectedquestions = values.questiontitles.map(
      (option: { value: string }) => option.value
    );
    const { data, error } = await supabase
      .from("Questions")
      .update({ Show: 1 })
      .in("questiontitle", selectedquestions);

    if (error) {
      console.error("doesn't work", error.message);
    } else {
      router.push("/");
      alert("Form successfully edited !");
    }
    const unselectedquestions = OPTIONS.filter(
      (option) => !selectedquestions.includes(option.value)
    );
    for (const option of unselectedquestions) {
      const { data, error } = await supabase
        .from("Questions")
        .update({ Show: 0 })
        .eq("questiontitle", option.value);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-sm mx-auto">
        <FormField
          control={form.control}
          name="questiontitles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Questions</FormLabel>
              <FormControl>
                <div>
                  <MultipleSelector
                    onChange={field.onChange}
                    defaultOptions={OPTIONS}
                    placeholder="Choose the Questions u want to display"
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        No more Questions
                      </p>
                    }
                  />
                </div>
              </FormControl>
              <FormDescription>
                Choose the Questions for your survey
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
