using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NYAidWebApp.DataContext;

namespace NYAidWebApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add database context
            services.AddDbContext<ApiDataContext>(opt => opt.UseInMemoryDatabase(ApiDataContext.DatabaseName));
            services.AddControllersWithViews();

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

            services.AddAuthentication().AddFacebook(facebookOptions =>
            {
                facebookOptions.AppId = Configuration["Authentication:Facebook:AppId"];
                facebookOptions.AppSecret = Configuration["Authentication:Facebook:AppSecret"];
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ApiDataContext ctx)
        {
            // Seed with sample data
            var seeder = new SampleDataSeeder();
            seeder.AddSampleData(ctx);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            // The 'UseSPA' environment variable is used for development purposes
            // to control the way the application uses the Angular SPA client. By
            // default, the project will compile and run the SPA application. This can 
            // lead to long compile times.
            // See https://docs.microsoft.com/en-us/aspnet/core/client-side/spa/angular?view=aspnetcore-3.1&tabs=visual-studio#run-ng-serve-independently
            // 
            // To work around this inconvenience, we use an environment variable to disable
            // this as needed. The UseSPA can be used in the following way:
            // UseSPA = "false"     => Completely disables SPA. Useful for backend dev
            // UseSPA = "external"  => Expects SPA to be served using 'npm start' or 'ng serve' prior to launch
            // UseSPA = null, missing or anything else => default, project will compile SPA
            var useSpa = System.Environment.GetEnvironmentVariable("UseSPA");

            // Always enable SPA for production, but allow UseSPA = 'false' in development mode
            if (env.IsProduction() ||  useSpa != "false")
            {
                app.UseSpa(spa =>
                {
                    // To learn more about options for serving an Angular SPA from ASP.NET Core,
                    // see https://go.microsoft.com/fwlink/?linkid=864501

                    spa.Options.SourcePath = "ClientApp";

                    if (env.IsDevelopment())
                    {
                        if (useSpa == "external")
                            spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                        else
                            spa.UseAngularCliServer(npmScript: "start");

                    }
                });
            }
        }
    }
}
