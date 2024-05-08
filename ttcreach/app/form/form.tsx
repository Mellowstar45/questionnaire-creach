"use client";
import React from "react";
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
import "@/app/styles/form.css";
const OPTIONS: Option[] = [
  { label: "French", value: "French" },
  { label: "English", value: "English" },
  { label: "German", value: "German" },
];
const optionSchema = z.object({
  value: z.string(),
});
const formSchema = z.object({
  email: z.string().email(),
  type: z.enum(["Coding", "Gaming", "Sleeping"], {
    required_error: "You need to select an option.",
  }),
  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(160, {
      message: "Bio must not be longer than 30 characters.",
    }),
  number: z.coerce.number().gte(1).lte(10),
  languages: z.array(optionSchema).min(1),
});

export default function Survey() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();
    const { data, error } = await supabase.from("Answers").insert([
      {
        email: values.email,
        Rating: values.number,
        bio: values.bio,
        Preference: values.type,
        Languages: values.languages,
      },
    ]);
    if (error) {
      console.error("doesn't work", error.message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input className="adjust" placeholder="email" {...field} />
              </FormControl>
              <FormDescription>What is your email ?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Hobby</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Coding" />
                    </FormControl>
                    <FormLabel className="font-normal">Coding</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Gaming" />
                    </FormControl>
                    <FormLabel className="font-normal">Gaming</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Sleeping" />
                    </FormControl>
                    <FormLabel className="font-normal">Sleeping</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Amongst these options. Which is your favorite thing to do ?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea className="resize-none" {...field} />
              </FormControl>
              <FormDescription>
                Talk a little bit about yourself
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                From a rating from 1 to 10, how much do you like the numerical
                world currently ?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="languages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frameworks</FormLabel>
              <FormControl>
                <div className="w-full">
                  <MultipleSelector
                    onChange={field.onChange}
                    defaultOptions={OPTIONS}
                    placeholder="Choose your languages..."
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        no results found.
                      </p>
                    }
                  />
                </div>
              </FormControl>
              <FormDescription> 
                Choose the language or languages you are proficient in
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
