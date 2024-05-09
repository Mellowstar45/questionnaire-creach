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
import "@/app/styles/form.css";
const OPTIONS: Option[] = [
  { label: "French", value: "French" },
  { label: "English", value: "English" },
  { label: "German", value: "German" },
];
const optionSchema = z.object({
  value: z.string().optional(),
});
const createFormSchema = (questions: Question[]) => {
  return z.object({
    email: questions.find(q => q.questiontitle === 'Email' && q.Show === 0) ?
      z.string().email().optional() : z.string().email(),
    hobby:questions.find(q => q.questiontitle === 'Hobby' && q.Show === 0) ? z.enum(["Coding", "Gaming", "Sleeping"], {
      required_error: "You need to select an option.",
    }).optional():z.enum(["Coding", "Gaming", "Sleeping"], {
      required_error: "You need to select an option.",
    }),
    bio:questions.find(q => q.questiontitle === 'Bio' && q.Show === 0) ? z.string()
      .min(10, {
        message: "Bio must be at least 10 characters.",
      })
      .max(160, {
        message: "Bio must not be longer than 30 characters.",
      }).optional() : z.string()
      .min(10, {
        message: "Bio must be at least 10 characters.",
      })
      .max(160, {
        message: "Bio must not be longer than 30 characters.",
      }),
    number:  questions.find(q => q.questiontitle === 'Number' && q.Show === 0) ? z.number().gte(1).lte(10).optional():  z.number().gte(1).lte(10),
    languages: questions.find(q => q.questiontitle === 'Languages' && q.Show === 0) ? z.array(optionSchema).min(1).optional(): z.array(optionSchema).min(1),
  });
};

interface Question {
  'Show': number;
  'questiontitle': string;
}
export default function Survey() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  
  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data, error } = await supabase
      .from('Questions')
      .select('Show, questiontitle');
      
      if (error) {
        console.error('Error fetching data:', error.message);
      } else {
        setQuestions(data as Question[]);
      }
    }
    
    fetchData();
  }, []);
  const formSchema = createFormSchema(questions);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number:1,
    },
  });
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();
    const { data, error } = await supabase.from("Answers").insert([
      {
        email: values.email || null,
        Rating: values.number || null,
        bio: values.bio || null,
        Preference: values.hobby || null,
        Languages: values.languages || null,
      },
    ]);
    if (error) {
      console.error("doesn't work", error.message);
    } else {
      router.push("/");
      alert("Form successfully sent, Thank you for your help !");
    }
  }

  return (
    <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-sm mx-auto">
    {questions.map((question) => {
      if (question.Show === 1) {
        switch (question.questiontitle) {
          case 'Email':
            return (
              <FormField
                key={question.questiontitle}
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="top">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input className="adjust" placeholder="email" {...field} />
                    </FormControl>
                    <FormDescription>What is your email ?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          case 'Hobby':
            return (
              <FormField
                key={question.questiontitle}
                control={form.control}
                name="hobby"
                render={({ field }) => (
                  <FormItem className="my-4">
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
                    <FormDescription>Amongst these options. Which is your favorite thing to do ?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          case 'Bio':
            return (
              <FormField
                key={question.questiontitle}
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="my-4">
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>Talk a little bit about yourself</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          case 'Number':
            return (
              <FormField
                key={question.questiontitle}
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem className="my-4">
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>From a rating from 1 to 10, how much do you like the numerical world currently ?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          case 'Languages':
            return (
              <FormField
                key={question.questiontitle}
                control={form.control}
                name="languages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frameworks</FormLabel>
                    <FormControl>
                      <div>
                        <MultipleSelector
                          onChange={field.onChange}
                          defaultOptions={OPTIONS}
                          placeholder="Choose your languages..."
                          emptyIndicator={
                            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">No more languages</p>
                          }
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Choose the language or languages you are proficient in</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          default:
            return null;
        }
      }
    })}
    <Button type="submit">Submit</Button>
  </form>
</Form>
  );
}
