"use client";

/**
 * 통계 분석 차트 (F015)
 * Recharts를 사용한 다양한 차트
 * Phase 3에서 실제 데이터 연동 예정
 */

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MOCK_DAILY_EVENTS,
  MOCK_DAILY_USERS,
  MOCK_EVENT_STATUS_DISTRIBUTION,
  MOCK_TOP_EVENTS,
  MOCK_USER_ROLE_DISTRIBUTION,
} from "@/lib/data/mock-data";

export function StatsCharts() {
  return (
    <div className="space-y-6">
      {/* 가입자 추이 */}
      <Card>
        <CardHeader>
          <CardTitle>가입자 추이</CardTitle>
          <CardDescription>최근 30일 누적 가입자 수</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={MOCK_DAILY_USERS}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 이벤트 생성 추이 */}
      <Card>
        <CardHeader>
          <CardTitle>이벤트 생성 추이</CardTitle>
          <CardDescription>최근 30일 상태별 이벤트 생성 수</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={MOCK_DAILY_EVENTS}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="draft" stackId="a" fill="#ef4444" name="예정" />
              <Bar dataKey="published" stackId="a" fill="#3b82f6" name="공개" />
              <Bar dataKey="completed" stackId="a" fill="#10b981" name="완료" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 상태 분포 & 역할 분포 - 2열 레이아웃 */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>이벤트 상태 분포</CardTitle>
            <CardDescription>현재 이벤트 상태별 개수</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={MOCK_EVENT_STATUS_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {MOCK_EVENT_STATUS_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>사용자 역할 분포</CardTitle>
            <CardDescription>현재 사용자 역할별 개수</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={MOCK_USER_ROLE_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {MOCK_USER_ROLE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 인기 이벤트 */}
      <Card>
        <CardHeader>
          <CardTitle>인기 이벤트 Top 10</CardTitle>
          <CardDescription>참여자 수 기준</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={MOCK_TOP_EVENTS}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={190} />
              <Tooltip />
              <Bar dataKey="participants" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
