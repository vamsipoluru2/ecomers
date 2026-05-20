import { Component, inject, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../app.config';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

interface StatsResponse {
  success: boolean;
  data: {
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalItemsSold: number;
    paidOrders: number;
    pendingOrders: number;
    failedOrders: number;
    avgOrderValue: number;
    topCategories: { category: string; count: number }[];
  };
}

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-statistics.component.html',
  styleUrls: ['./admin-statistics.component.css'],
})
export class AdminStatsComponent implements OnInit, AfterViewInit {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiBase;

  @ViewChild('orderStatusChart') orderStatusChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryChart') categoryChart!: ElementRef<HTMLCanvasElement>;

  loading = true;
  error = '';
  stats: any = null;

  private orderChart: Chart | null = null;
  private catChart: Chart | null = null;

  ngOnInit() {
    this.loadStatistics();
  }

  ngAfterViewInit() {
    // Charts will be created after data is loaded
  }

  loadStatistics() {
    this.http.get<StatsResponse>(`${this.API_URL}/api/admin/statistics`).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats = response.data;
          this.loading = false;
          // Create charts after data is loaded
          setTimeout(() => this.createCharts(), 100);
        } else {
          this.error = 'Failed to load statistics.';
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error loading statistics:', err);
        this.error = 'Failed to load statistics. Please try again.';
        this.loading = false;
      },
    });
  }

  createCharts() {
    if (!this.stats) return;

    // Order Status Pie Chart
    if (this.orderStatusChart && this.orderStatusChart.nativeElement) {
      const ctx = this.orderStatusChart.nativeElement.getContext('2d');
      if (ctx) {
        this.orderChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Paid Orders', 'Pending Orders', 'Failed Orders'],
            datasets: [{
              data: [
                this.stats.paidOrders || 0,
                this.stats.pendingOrders || 0,
                this.stats.failedOrders || 0
              ],
              backgroundColor: [
                'rgba(40, 167, 69, 0.8)',  // Success green
                'rgba(255, 193, 7, 0.8)',   // Warning yellow
                'rgba(220, 53, 69, 0.8)'    // Danger red
              ],
              borderColor: [
                'rgba(40, 167, 69, 1)',
                'rgba(255, 193, 7, 1)',
                'rgba(220, 53, 69, 1)'
              ],
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 15,
                  font: {
                    size: 12
                  }
                }
              },
              title: {
                display: true,
                text: 'Order Status Distribution',
                font: {
                  size: 16,
                  weight: 'bold'
                },
                padding: 20
              }
            }
          }
        });
      }
    }

    // Category Bar Chart
    if (this.categoryChart && this.categoryChart.nativeElement && this.stats.topCategories) {
      const ctx = this.categoryChart.nativeElement.getContext('2d');
      if (ctx) {
        const categories = this.stats.topCategories.map((c: any) => c.category);
        const counts = this.stats.topCategories.map((c: any) => c.count);

        this.catChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: categories,
            datasets: [{
              label: 'Number of Products',
              data: counts,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: true,
                text: 'Products by Category',
                font: {
                  size: 16,
                  weight: 'bold'
                },
                padding: 20
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        });
      }
    }
  }

  ngOnDestroy() {
    // Clean up charts
    if (this.orderChart) {
      this.orderChart.destroy();
    }
    if (this.catChart) {
      this.catChart.destroy();
    }
  }
}
