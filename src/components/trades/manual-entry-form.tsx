"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTrade } from "@/lib/actions";

const formSchema = z.object({
  instrument: z.string().min(1, "Instrument is required (e.g. ES, NQ)"),
  direction: z.enum(["LONG", "SHORT"]),
  entryPrice: z.string().min(1, "Entry price is required"),
  exitPrice: z.string().optional(),
  quantity: z.string().min(1, "Quantity is required"),
  entryTime: z.string().min(1, "Entry time is required"),
  exitTime: z.string().optional(),
  grossPnl: z.string().min(1, "Gross P&L is required"),
  commission: z.string().optional(),
  notes: z.string().optional(),
  session: z.enum(["PREMARKET", "REGULAR", "AFTERHOURS", "OVERNIGHT"]),
});

export function ManualTradeEntryForm({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instrument: "",
      direction: "LONG",
      entryPrice: "",
      exitPrice: "",
      quantity: "1",
      entryTime: new Date().toISOString().slice(0, 16),
      exitTime: "",
      grossPnl: "",
      commission: "0",
      notes: "",
      session: "REGULAR",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const netPnl = Number(values.grossPnl) - Number(values.commission || "0");
    
    const result = await createTrade({
      ...values,
      netPnl,
      userId,
    });

    setIsLoading(false);
    if (result.success) {
      form.reset();
      // Add success toast or notification here
    }
  }

  return (
    <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 backdrop-blur-sm">
      <h3 className="text-xl font-semibold text-white mb-6">Log New Trade</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="instrument"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instrument</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. ES, NQ, AAPL" {...field} className="bg-zinc-800 border-zinc-700" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="direction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Direction</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="Select direction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="LONG">Long</SelectItem>
                      <SelectItem value="SHORT">Short</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="entryPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} className="bg-zinc-800 border-zinc-700" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="exitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exit Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} className="bg-zinc-800 border-zinc-700" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="bg-zinc-800 border-zinc-700" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grossPnl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gross P&L ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} className="bg-zinc-800 border-zinc-700" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="entryTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} className="bg-zinc-800 border-zinc-700" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="session"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="Select session" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="PREMARKET">Pre-market</SelectItem>
                      <SelectItem value="REGULAR">Regular Session</SelectItem>
                      <SelectItem value="AFTERHOURS">After-hours</SelectItem>
                      <SelectItem value="OVERNIGHT">Overnight</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Add some context to this trade..." className="bg-zinc-800 border-zinc-700" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Trade
          </Button>
        </form>
      </Form>
    </div>
  );
}
