import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertSubscriberSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const formSchema = insertSubscriberSchema.extend({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
});

type FormValues = z.infer<typeof formSchema>;

export function NewsletterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });
  
  const subscribeMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await apiRequest("POST", "/api/subscribers", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "¡Suscripción exitosa!",
        description: "Gracias por suscribirte a nuestra newsletter.",
        variant: "default",
      });
      form.reset();
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        title: "Error al suscribirse",
        description: "Hubo un problema al procesar tu solicitud. Por favor intenta de nuevo.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });
  
  function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    subscribeMutation.mutate(data);
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Nombre"
                  {...field}
                  className="w-full px-4 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
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
              <FormControl>
                <Input
                  placeholder="Email"
                  type="email"
                  {...field}
                  className="w-full px-4 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition-colors"
        >
          {isSubmitting ? "Enviando..." : "Suscribirse"}
        </Button>
      </form>
    </Form>
  );
}
