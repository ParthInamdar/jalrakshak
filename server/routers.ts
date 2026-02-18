import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createIrrigationLog, getUserIrrigationLogs, getUserTotalWaterSaved } from "./db";
import { getIrrigationDecision, calculateWaterSaved, getDaysDelayed } from "./irrigation";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  irrigation: router({
    /**
     * Get irrigation recommendation based on location, crop, and weather
     */
    getRecommendation: protectedProcedure
      .input(
        z.object({
          location: z.string().min(1),
          crop: z.string().min(1),
          soil: z.enum(["Clay", "Loamy", "Sandy"]),
          lastIrrigationDate: z.string(),
          fieldSize: z.number().positive(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Mock weather data (in production, call OpenWeatherMap API)
        const temperature = 28;
        const humidity = 65;
        const rainProbability = Math.random() > 0.5 ? 70 : 20;

        // Get irrigation decision
        const recommendation = getIrrigationDecision(
          input.lastIrrigationDate,
          rainProbability,
          input.soil
        );

        // Calculate water saved
        const daysDelayed = getDaysDelayed(recommendation);
        const waterSaved = calculateWaterSaved(input.fieldSize, daysDelayed);

        // Save to database
        const log = await createIrrigationLog({
          userId: ctx.user.id,
          location: input.location,
          crop: input.crop,
          soil: input.soil,
          lastIrrigationDate: input.lastIrrigationDate,
          fieldSize: input.fieldSize.toString(),
          temperature: temperature.toString(),
          humidity: humidity.toString(),
          rainProbability,
          recommendation,
          waterSaved: waterSaved.toString(),
        });

        return {
          recommendation,
          temperature,
          humidity,
          rainProbability,
          waterSaved,
          log,
        };
      }),

    /**
     * Get all irrigation logs for the current user
     */
    getLogs: protectedProcedure.query(async ({ ctx }) => {
      return await getUserIrrigationLogs(ctx.user.id);
    }),

    /**
     * Get total water saved by the current user
     */
    getTotalWaterSaved: protectedProcedure.query(async ({ ctx }) => {
      return await getUserTotalWaterSaved(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
