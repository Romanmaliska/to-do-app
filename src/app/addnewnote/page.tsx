'use client';

import { addNewNote } from '@/app/actions/mongoDBactions';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  tittle: z.string().min(1, {
    message: 'Tittle must be at least 1 character.',
  }),
  text: z.string().min(3, {
    message: 'Text must be at least 3 characters.',
  }),
});

export default function AddNewNotePage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addNewNote(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-8">
        <FormField
          control={form.control}
          name="tittle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tittle</FormLabel>
              <FormControl>
                <Input placeholder="Add your ToDo tittle..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Textarea placeholder="Add your ToDo text..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
