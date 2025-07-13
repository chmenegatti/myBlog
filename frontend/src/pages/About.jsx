import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Chip,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  Engineering,
  Cloud,
  Code,
  Architecture,
  Speed,
  School,
} from '@mui/icons-material';

const About = () => {
  const theme = useTheme();

  const skills = [
    'Go (Golang)',
    'JavaScript',
    'Node.js',
    'MySQL',
    'RabbitMQ',
    'VMware NSX',
    'PHP',
    'HTML/CSS',
    'JWT',
    'Cloud Architecture',
    'High Performance Systems',
  ];

  const milestones = [
    {
      year: '2007',
      title: 'Formação em Engenharia Civil',
      subtitle: 'Escola de Engenharia de Piracicaba',
      icon: <Engineering />,
    },
    {
      year: '2007-2015',
      title: 'Engenheiro & Gerente de Projetos',
      subtitle: 'Construção Civil & Arquitetura',
      icon: <Architecture />,
    },
    {
      year: '2015-2020',
      title: 'Desenvolvimento de Sistemas Próprios',
      subtitle: 'Soluções para Gestão e Otimização',
      icon: <Code />,
    },
    {
      year: '2021',
      title: 'MBA em Engenharia de Software',
      subtitle: 'Cruzeiro do Sul Virtual',
      icon: <School />,
    },
    {
      year: '2021-Presente',
      title: 'Especialista em Desenvolvimento Cloud',
      subtitle: 'TOTVS - Gateway & Alta Performance',
      icon: <Cloud />,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 6,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 60,
            height: 4,
            backgroundColor: 'primary.main',
            borderRadius: 2,
          },
        }}
      >
        <Avatar
          sx={{
            width: 120,
            height: 120,
            mx: 'auto',
            mb: 3,
            backgroundColor: 'primary.main',
            fontSize: '3rem',
            fontWeight: 'bold',
          }}
        >
          CM
        </Avatar>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Cesar Menegatti
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ fontWeight: 300, maxWidth: 600, mx: 'auto' }}
        >
          Da Construção de Edifícios à Arquitetura de Sistemas Escaláveis
        </Typography>
      </Box>

      {/* Introduction */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          backgroundColor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="body1"
          paragraph
          sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}
        >
          Meu nome é Cesar Menegatti e minha trajetória profissional é a prova
          viva de que a paixão por resolver problemas pode construir pontes
          entre mundos aparentemente distintos. Hoje, como{' '}
          <strong>Especialista em Desenvolvimento Cloud na TOTVS</strong>,
          dedico meus dias a criar e otimizar sistemas de alta performance, mas
          minha jornada começou com capacetes, plantas de construção e o desafio
          de erguer estruturas no mundo físico.
        </Typography>
        <Typography
          variant="body1"
          sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}
        >
          Sou um engenheiro que se tornou desenvolvedor, e essa dualidade define
          a minha forma de pensar e inovar.
        </Typography>
      </Paper>

      {/* Timeline */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}
        >
          Jornada Profissional
        </Typography>
        <Grid container spacing={3}>
          {milestones.map((milestone, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        mr: 2,
                      }}
                    >
                      {milestone.icon}
                    </Box>
                    <Chip
                      label={milestone.year}
                      size="small"
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {milestone.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {milestone.subtitle}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Main Content Sections */}
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} lg={8}>
          {/* Os Alicerces */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              backgroundColor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              sx={{ fontWeight: 600, color: 'primary.main' }}
            >
              Os Alicerces: A Mentalidade de Engenheiro
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              Formado em Engenharia Civil em 2007 pela Escola de Engenharia de
              Piracicaba, mergulhei de cabeça no universo da construção. Atuando
              como Engenheiro e Gerente de Projetos de Engenharia e Arquitetura,
              aprendi na prática o significado de disciplina, planejamento
              rigoroso e gestão de recursos.
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              Foi nesse ambiente que a tecnologia começou a se manifestar não
              como uma carreira, mas como uma ferramenta indispensável. Movido
              por uma iniciativa intrínseca, comecei a desenvolver minhas
              próprias aplicações para otimizar o dia a dia nos canteiros de
              obras e escritórios.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              Criei sistemas para Gestão de FVS e FVM, controle de equipamentos,
              gestão de almoxarifado e administração de imóveis. Cada sistema
              que eu projetava não era apenas um software, mas uma solução
              direta para um problema de negócio real.
            </Typography>
          </Paper>

          {/* A Transição */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              backgroundColor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              sx={{ fontWeight: 600, color: 'primary.main' }}
            >
              A Transição: Construindo uma Nova Carreira
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              Com o passar dos anos, a paixão pela programação deixou de ser um
              hobby para se tornar um chamado. Percebi que a lógica, a
              estruturação e a criatividade que eu aplicava para construir
              edifícios eram perfeitamente transferíveis para a arquitetura de
              software.
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              O passo decisivo foi o{' '}
              <strong>
                MBA em Engenharia de Software pela Cruzeiro do Sul Virtual
              </strong>
              , concluído em 2021. Essa especialização me deu a base teórica
              robusta para complementar a experiência prática que eu já havia
              acumulado.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              Essa jornada de transição reforçou uma das minhas soft skills mais
              importantes: a <strong>adaptabilidade</strong>. Mudar de um campo
              tão estabelecido como a Engenharia Civil para o dinâmico mundo da
              tecnologia exigiu coragem, resiliência e um compromisso incansável
              com o aprendizado contínuo.
            </Typography>
          </Paper>

          {/* O Presente */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              backgroundColor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              sx={{ fontWeight: 600, color: 'primary.main' }}
            >
              O Presente: Especialização em Cloud e Alta Performance
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              Minha trajetória me levou à <strong>TOTVS</strong>, a maior
              empresa de tecnologia do Brasil, onde encontrei o ambiente
              perfeito para aplicar e expandir meu conjunto de habilidades.
              Crescendo rapidamente para a posição de{' '}
              <strong>Especialista II em Desenvolvimento Cloud</strong>, hoje
              atuo na linha de frente do Gateway.
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              Minha responsabilidade principal é a manutenção e criação de novas
              funcionalidades, sempre com o foco absoluto em{' '}
              <strong>
                alta disponibilidade, performance e escalabilidade
              </strong>
              . O trabalho envolve uma profunda compreensão de arquitetura de
              software e maestria em tecnologias de ponta.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              Essa jornada na TOTVS demonstra minha capacidade de prosperar em
              ambientes complexos e de alta exigência, além de uma{' '}
              <strong>proatividade</strong> constante na busca por desafios que
              me permitam crescer e entregar valor significativo.
            </Typography>
          </Paper>
        </Grid>

        {/* Right Column - Skills & Contact */}
        <Grid item xs={12} lg={4}>
          {/* Skills */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              backgroundColor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h6"
              component="h3"
              gutterBottom
              sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}
            >
              <Speed sx={{ mr: 1, color: 'primary.main' }} />
              Tecnologias & Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  variant="outlined"
                  size="small"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    },
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Valores */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h6"
              component="h3"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Minha Proposta de Valor
            </Typography>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.6 }}>
              Hoje, eu não sou apenas um desenvolvedor; sou um{' '}
              <strong>arquiteto de soluções</strong> com uma perspectiva única.
            </Typography>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.6 }}>
              A disciplina e o pensamento estruturado da engenharia civil me dão
              uma base sólida para projetar sistemas complexos. Minha
              experiência em gerenciamento de projetos me permite comunicar com
              clareza e traduzir necessidades do negócio em requisitos técnicos
              eficazes.
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
              Acredito que a inovação nasce na interseção de diferentes campos
              do conhecimento. Estou sempre em busca do próximo desafio, do
              próximo problema complexo a ser resolvido.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About;
