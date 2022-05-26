import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 12vh;
  background-color: var(--white);
  border: 1px solid #e1e3e6;
  box-sizing: border-box;
  border-radius: 5px;
  margin: 0 3rem 1rem 3rem;
`

export const BoxId = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`

export const BoxTitle = styled.div`
  flex: 3;
`

export const BoxDeadline = styled.div`
  flex: 2;
`

export const BoxValue = styled.div`
  flex: 1;
`

export const BoxStatus = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
`

export const BoxActions = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-evenly;
`

export const Id = styled.h3`
  font-family: IBM Plex Sans, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 26px;
  color: var(--text-body);
`

export const JobTitle = styled.h1`
  font-family: IBM Plex Sans, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 34px;
  color: var(--text-title);
`

export const Title = styled.p`
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 22px;
  color: var(--text-body);
`

export const SubTitle = styled.h2`
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 26px;
  color: var(--text-title);
`

export const StatusWrapper = styled.div`
  width: 13rem;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 40px;

  background: ${({ status }) => status === "Em andamento" ? "var(--green-100)" : "var(--red-100)"};

  h3 {
    color: ${({ status }) => status === "Em andamento" ? "var(--green)" : "var(--red)"};
  }
`

export const StatusLabel = styled.h3`
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 26px;
`

export const ButtonAction = styled.button`
  padding: 0.2rem 0.4rem;
  background: var(--white);
  border: 1px solid #e1e3e6;
  box-sizing: border-box;
  border-radius: 5px;
  transform: matrix(-1, 0, 0, 1, 0, 0);
`