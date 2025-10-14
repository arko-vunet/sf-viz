# Bento Grid Layout System

A flexible, responsive grid layout system for arranging widgets in dashboards, inspired by bento box layouts.

## Features

- **Widget-Focused**: Generic layout system for any widgets you want to display
- **Responsive Behavior**: Automatically adapts to mobile, tablet, and desktop breakpoints
- **Flexible Panel Heights**: Default 384px minimum height with customizable overrides
- **Simple API**: Just specify your widgets - they'll be arranged in a responsive grid
- **Custom Layouts**: Define your own widget arrangements when needed
- **TypeScript Ready**: Full type safety and IntelliSense support

## Quick Start

### Basic Usage

```jsx
import BentoGrid from "@/components/BentoGrid";
import Panel from "@/components/Panel";

// Define your widgets - any widgets you want to display
const widgets = {
  area1: {
    component: (
      <Panel title="Sales Overview" description="Revenue and growth metrics">
        <div>Your sales widget content here</div>
      </Panel>
    )
  },
  area2: {
    component: (
      <Panel title="User Analytics" minHeight={200}>
        <div>User engagement data</div>
      </Panel>
    )
  },
  area3: {
    component: (
      <Panel title="Performance Chart">
        <div>Chart visualization</div>
      </Panel>
    )
  }
};

// Simple - widgets are arranged in responsive grid
<BentoGrid widgets={widgets} />
```

### Widget Layout

The system provides a responsive grid layout that works well for dashboard widgets:

**Layout Structure:**
- **Mobile**: 4 columns - widgets arranged in a single column
- **Tablet**: 8 columns - widgets arranged with more space
- **Desktop**: 12 columns - widgets arranged with maximum space

**Default Widget Positions:**
- `area1` - Primary widget area (largest space)
- `area2` - Secondary widget area
- `area3` - Tertiary widget area
- `area4` - Quaternary widget area

**Usage:**
```jsx
// Simple usage - widgets arranged in responsive grid
<BentoGrid widgets={widgets} />

// You can name your widget positions anything you want
const myWidgets = {
  salesOverview: { component: <SalesWidget /> },
  userStats: { component: <UserStatsWidget /> },
  chart: { component: <ChartWidget /> },
  summary: { component: <SummaryWidget /> }
};

<BentoGrid widgets={myWidgets} />
```

## Panel Heights

Panels have a default minimum height of **384px** (as requested). You can override this:

```jsx
// Use default height (384px)
<Panel title="Default Height">
  <div>Content</div>
</Panel>

// Custom minimum height
<Panel title="Custom Height" minHeight={500}>
  <div>Content</div>
</Panel>

// Maximum height constraint
<Panel title="Constrained Height" minHeight={300} maxHeight={400}>
  <div>Content</div>
</Panel>

// Exact height
<Panel title="Exact Height" height={600}>
  <div>Content</div>
</Panel>
```

## Responsive Behavior

The grid automatically adapts to screen sizes:

- **Mobile**: 4 columns (≤ 767px)
- **Tablet**: 8 columns (768px - 1023px)
- **Desktop**: 12 columns (≥ 1024px)

Each preset defines specific layouts for each breakpoint, ensuring optimal widget positioning across devices.

## Advanced Usage

### Custom Layouts

Define your own layout configuration:

```jsx
const customLayout = {
  name: "My Custom Layout",
  breakpoints: {
    mobile: { cols: 4 },
    tablet: { cols: 8 },
    desktop: { cols: 12 }
  },
  layouts: {
    mobile: [
      { id: "main", x: 0, y: 0, w: 4, h: 3 },
      { id: "sidebar", x: 0, y: 3, w: 2, h: 1 }
    ],
    tablet: [
      { id: "main", x: 0, y: 0, w: 6, h: 4 },
      { id: "sidebar", x: 6, y: 0, w: 2, h: 2 }
    ],
    desktop: [
      { id: "main", x: 0, y: 0, w: 8, h: 5 },
      { id: "sidebar", x: 8, y: 0, w: 4, h: 2 }
    ]
  }
};

<BentoGrid customLayout={customLayout} widgets={widgets} />
```

### Combining Multiple Presets

Create complex layouts by combining presets:

```jsx
import { mergePresets } from "@/lib/bento-grid";

const combinedPreset = mergePresets(
  { /* dashboard layout */ },
  { /* content layout */ }
);

<BentoGrid customLayout={combinedPreset} widgets={widgets} />
```

### Multiple Sections on One Page

```jsx
<div className="space-y-8">
  {/* Section 1 */}
  <div>
    <h2>Dashboard</h2>
    <BentoGrid preset="dashboard" widgets={dashboardWidgets} />
  </div>

  {/* Section 2 */}
  <div>
    <h2>Content Focus</h2>
    <BentoGrid preset="content" widgets={contentWidgets} />
  </div>
</div>
```

## Props Reference

### BentoGrid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `preset` | string | `"dashboard"` | Layout preset to use |
| `widgets` | object | `{}` | Widget components mapped by ID |
| `customLayout` | object | `null` | Custom layout configuration |
| `className` | string | `""` | Additional CSS classes |
| `containerClassName` | string | `""` | Container CSS classes |
| `gap` | string | `"16px"` | Grid gap size |
| `showGridOverlay` | boolean | `false` | Show grid overlay for debugging |

### Panel Props (Height-related)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `minHeight` | number | `384` | Minimum height in pixels |
| `maxHeight` | number | `undefined` | Maximum height in pixels |
| `height` | number | `undefined` | Exact height in pixels |

## File Structure

```
lib/
  └── bento-grid.js          # Core utilities and presets

components/
  ├── BentoGrid.jsx          # Main grid component
  ├── BentoExample.jsx       # Usage examples
  ├── CombinedPresetsExample.jsx # Advanced examples
  └── Panel.jsx              # Updated panel component
```

## Examples

See the example components for complete usage patterns:

- `BentoExample.jsx` - Basic preset usage
- `CombinedPresetsExample.jsx` - Advanced layout combinations

## Migration from Existing Layout

If you're migrating from manual grid layouts:

1. **Define your widgets** - wrap each widget in a Panel component
2. **Name your widget positions** - use any names that make sense for your layout
3. **Replace col-span classes** with BentoGrid - it handles responsive layout automatically
4. **Customize heights** using Panel height props when needed

The system provides responsive widget arrangement without needing to manually specify column spans.
