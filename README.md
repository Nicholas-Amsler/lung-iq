# 🫁 Lung IQ: Clinical Waveform Simulator

An open-source ventilator waveform simulator designed for medical education, supporting patients from 650g micro-preemies to 120kg adults with real-time pathophysiology modeling.

**🌐 Live Demo:** [lungiq.amslerlabs.com](https://lungiq.amslerlabs.com)

![Lung IQ Screenshot](https://via.placeholder.com/800x400/1a1a1a/00ff00?text=Add+Screenshot+Here)

## ✨ Features

### 🏥 **Comprehensive Patient Demographics**
- **Pediatric Support**: 650g micro-preemies to adolescents
- **Adult Support**: 18+ years up to 120kg
- **Dynamic Calculations**: Weight-based tidal volumes, IBW targeting
- **Age-Appropriate Ranges**: Automatic parameter constraints

### 📊 **Real-Time Clinical Simulation**
- **Live Waveform Generation**: Pressure, flow, and volume curves
- **Pathophysiology Modeling**: ARDS, COPD, auto-PEEP, pneumothorax
- **Evidence-Based Calculations**: ARDSnet protocols, pediatric guidelines
- **Interactive Parameters**: Real-time response to ventilator changes

### 📚 **Educational Framework**
- **40+ Clinical Scenarios**: From normal lungs to complex pathology
- **Progressive Learning**: Unlockable scenarios and achievements
- **Learning Paths**: Structured education modules
- **Assessment Tools**: Built-in quizzes and competency tracking

### 🔬 **Advanced Capabilities**
- **Multi-Modal Ventilation**: Volume control, pressure control, SIMV
- **Clinical Calculations**: Minute ventilation, plateau pressure, compliance
- **Export Functionality**: Session data and waveforms
- **Mobile Optimized**: Touch-friendly interface for tablets

## 🎯 Target Audience

- **Medical Students** learning mechanical ventilation
- **Respiratory Therapists** practicing clinical scenarios
- **NICU Nurses** training with micro-preemie ventilation
- **Educators** teaching pulmonary physiology
- **Healthcare Institutions** in resource-limited settings

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
git clone https://github.com/Nicholas-Amsler/lung-iq.git
cd lung-iq
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the simulator.

### Docker Deployment

```bash
docker build -t lung-iq .
docker run -p 3000:3000 lung-iq
```

## 📱 Usage

1. **Select Patient Demographics**: Choose age group and adjust weight
2. **Configure Ventilator Settings**: Set PEEP, PIP, respiratory rate
3. **Choose Clinical Scenario**: Normal lungs or pathological conditions
4. **Observe Real-Time Waveforms**: Pressure, flow, and volume curves
5. **Analyze Clinical Metrics**: Tidal volume, minute ventilation, compliance
6. **Export Data**: Download session data for analysis

### 🧪 Hidden Features
- **Konami Code**: `↑↑↓↓←→←→BA` for developer easter egg
- **Dark/Light Mode**: Toggle for different learning environments
- **Mobile Gestures**: Swipe and pinch for mobile optimization

## 🏥 Clinical Scenarios

### **Neonatal/Pediatric**
- 650g micro-preemie with RDS
- Pediatric asthma exacerbation  
- Congenital diaphragmatic hernia
- Bronchopulmonary dysplasia

### **Adult Critical Care**
- ARDS (mild, moderate, severe)
- COPD exacerbation with auto-PEEP
- Pneumothorax with tension physiology
- Post-operative normal lungs

### **Advanced Pathophysiology**
- Dynamic compliance changes
- Auto-PEEP detection and management
- Ventilator-induced lung injury
- Weaning readiness assessment

## ⚖️ Medical Disclaimer

**FOR EDUCATIONAL PURPOSES ONLY**

This simulator is designed for medical education and training. It is NOT intended for:
- Clinical decision making
- Patient care guidance  
- Replacement of clinical judgment
- Use without proper medical supervision

Always consult qualified healthcare professionals for patient care decisions.

## 🤝 Contributing

We welcome contributions from the medical and development communities!

### Ways to Contribute
- **Clinical Scenarios**: Add new pathophysiology cases
- **Translations**: Multi-language support
- **Features**: Enhanced simulation capabilities
- **Documentation**: Improve educational content
- **Bug Reports**: Help us improve reliability

### Development Setup

```bash
# Fork the repository
# Clone your fork
git clone https://github.com/YOUR-USERNAME/lung-iq.git

# Create feature branch
git checkout -b feature/new-scenario

# Make changes and test
npm run dev
npm run build
npm run lint

# Submit pull request
```

## 📈 Evidence Base

This simulator incorporates guidelines from:
- **ARDSnet Protocols**: Low tidal volume ventilation
- **American Academy of Pediatrics**: Neonatal ventilation guidelines  
- **AARC Clinical Practice Guidelines**: Mechanical ventilation standards
- **Published Literature**: Peer-reviewed respiratory physiology research

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Visualization**: Plotly.js for real-time waveforms
- **Styling**: Tailwind CSS for responsive design
- **Deployment**: Vercel with global CDN
- **State Management**: React hooks and context

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Medical Educators** who provided clinical guidance
- **Respiratory Therapists** who validated scenarios
- **Open Source Community** for framework and tools
- **Healthcare Workers** who inspired this project

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Nicholas-Amsler/lung-iq/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Nicholas-Amsler/lung-iq/discussions)
- **Website**: [lungiq.amslerlabs.com](https://lungiq.amslerlabs.com)
- **Developer**: [Amsler Labs](https://amslerlabs.com)

---

**🌍 Help us improve medical education worldwide by contributing to Lung IQ!**

Made with ❤️ for the global healthcare community
