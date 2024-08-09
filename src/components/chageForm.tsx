import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
} from "./ui/select";
import { Link, Loader } from "lucide-react";
import { Label } from "./ui/label";

interface Currency {
  currency: string;
  date: string;
  price: number;
}

const formSchema = z.object({
  startExchange: z
    .string()
    .regex(/^\d+([.]\d+)?$/, {
      message: "Amount to send need to be a number",
    })
    .min(1),
  endExchange: z
    .string()

    .min(1),
  startExchangeCurrency: z.string(),
  endExchangeCurrency: z.string(),
});
export function ChangeForm() {
  const [currencyPlan, setCurrencyPlan] = useState<Currency[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      startExchange: "0",
      endExchange: "0",
      startExchangeCurrency: currencyPlan?.[0]?.currency || "",
      endExchangeCurrency: currencyPlan?.[1]?.currency || "",
    },
  });
  function getPrice(currencyCode: string) {
    if (!currencyPlan) return 1;
    const price = currencyPlan.find(
      (item) => item.currency === currencyCode
    )?.price;
    return price || 1;
  }
  function onSubmit(values: z.infer<typeof formSchema>) {
    const amountSend = Number(values.startExchange);
    const amountReceived =
      (amountSend / getPrice(values.startExchangeCurrency)) *
      getPrice(values.endExchangeCurrency);

    form.setValue("endExchange", amountReceived.toFixed(8).toString());
  }

  useEffect(() => {
    fetchCurrencyPlan();
  }, []);

  const fetchCurrencyPlan = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get<Currency[]>(
        "https://interview.switcheo.com/prices.json"
      );
      const uniqCurrency = Object.values(
        data.reduce((acc, item) => {
          acc[item.currency] = item;
          return acc;
        }, {} as Record<string, Currency>)
      );
      setCurrencyPlan(uniqCurrency);
      form.setValue("startExchangeCurrency", uniqCurrency[0].currency);
      form.setValue("endExchangeCurrency", uniqCurrency[1].currency);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching currency data:", error);
    }
  };

  return (
    <div className="  px-8 py-8 rounded-3xl flex flex-col items-center h-full  ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-[90%]   items-center justify-between h-full"
        >
          <div className="flex-1 flex flex-col items-center gap-16">
            <span className="text-2xl font-[700] ">
              Your personal currency exchanger
            </span>
            {isLoading ? (
              <Loader className="repeat-infinite rotate-45" />
            ) : (
              <div className="flex flex-row justify-between gap-4 w-full ">
                <div>
                  <Label>Amount to send</Label>
                  <div className="flex flex-row  mt-2">
                    <FormField
                      control={form.control}
                      name="startExchangeCurrency"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className=" border-2  border-slate-950 rounded-r-none w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {currencyPlan?.map((item) => {
                                const endExchange = form.watch(
                                  "endExchangeCurrency"
                                );
                                if (item.currency === endExchange) return null;
                                return (
                                  <SelectItem value={item.currency}>
                                    <div className="flex flex-row items-center gap-2">
                                      <img
                                        src={`/public/assets/${item.currency}.svg`}
                                        alt={"sdf"}
                                        className="w-[20px] h-[20px]"
                                      />
                                      <span>{item.currency}</span>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="startExchange"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className=" rounded-l-none border-2 border-slate-950 border-l-[0px]"
                              placeholder="Enter your amount"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div>
                  <Label>Amount to receive</Label>
                  <div className="flex flex-row  mt-2">
                    <FormField
                      control={form.control}
                      name="endExchangeCurrency"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className=" border-2  border-slate-950 rounded-r-none w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {currencyPlan?.map((item) => {
                                const startExchange = form.watch(
                                  "startExchangeCurrency"
                                );
                                if (item.currency === startExchange)
                                  return null;
                                return (
                                  <SelectItem value={item.currency}>
                                    <div className="flex flex-row items-center gap-2">
                                      <img
                                        src={`/public/assets/${item.currency}.svg`}
                                        alt={"sdf"}
                                        className="w-[20px] h-[20px]"
                                      />
                                      <span>{item.currency}</span>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endExchange"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              disabled
                              className=" rounded-l-none border-2 border-slate-950 border-l-[0px] cursor-text"
                              placeholder="Enter your amount"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <Button type="submit" className="w-full ">
            Swap
          </Button>
        </form>
      </Form>
    </div>
  );
}
